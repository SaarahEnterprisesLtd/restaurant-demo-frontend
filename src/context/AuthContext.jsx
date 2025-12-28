// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiLogin, apiLogout, apiMe, apiRegister } from "../api/auth";
import { apiAddCartItem, apiGetCart } from "../api/cart";
import { useCart } from "./CartContext";

const AuthContext = createContext(null);

function isUnauthorized(err) {
  // Support different error shapes (fetch/axios/custom)
  const status = err?.status || err?.response?.status;
  const code = err?.code || err?.response?.data?.code || err?.data?.code;
  return status === 401 || code === "TOKEN_EXPIRED";
}

export function AuthProvider({ children }) {
  const cart = useCart();

  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // ✅ message to show in UI ("Session expired...")
  const [authNotice, setAuthNotice] = useState("");

  const bootDoneRef = useRef(false);
  const expiryHandledRef = useRef(false);

  function logoutLocalWithMessage(message) {
    setUser(null);
    setAuthNotice(message || "Session expired. Please log in again.");
  }

  // Clear notice after a while (optional)
  useEffect(() => {
    if (!authNotice) return;
    const t = setTimeout(() => setAuthNotice(""), 4000);
    return () => clearTimeout(t);
  }, [authNotice]);

  async function refreshMe({ setBoot = false, silent = false } = {}) {
    try {
      const data = await apiMe();
      setUser(data?.user ?? data ?? null);
      return data;
    } catch (err) {
      // ✅ If session expired / unauthorized: logout locally + show message
      if (isUnauthorized(err)) {
        // prevent multiple popups/messages if several requests 401 at once
        if (!expiryHandledRef.current) {
          expiryHandledRef.current = true;
          logoutLocalWithMessage("Session expired. Please log in again.");
          setTimeout(() => {
            expiryHandledRef.current = false;
          }, 1500);
        } else {
          setUser(null);
        }

        // ✅ IMPORTANT: do NOT throw by default — prevents menu page breaking
        if (!silent) return null;
        return null;
      }

      // other errors still throw (network/server)
      setUser(null);
      throw err;
    } finally {
      if (setBoot && !bootDoneRef.current) {
        bootDoneRef.current = true;
        setBooting(false);
      }
    }
  }

  useEffect(() => {
    refreshMe({ setBoot: true }).catch(() => {
      // booting cleared in finally
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, password) {
    const data = await apiLogin(email, password);

    if (data?.user) setUser(data.user);

    // hydrate canonical session user
    await refreshMe({ silent: true });
    // inside login()
    setAuthNotice("");

    // merge guest cart into DB cart
    const payload = cart.toPayload ? cart.toPayload() : [];
    if (Array.isArray(payload) && payload.length > 0) {
      for (const row of payload) {
        await apiAddCartItem(row.menuItemId, row.qty);
      }
    }

    // replace local cart with server cart
    const serverCart = await apiGetCart();
    cart.replace(serverCart?.items || []);

    return data;
  }

  async function register(payload) {
    const data = await apiRegister(payload);

    // hydrate session
    await refreshMe({ silent: true });

    const guest = cart.toPayload ? cart.toPayload() : [];
    if (Array.isArray(guest) && guest.length > 0) {
      for (const row of guest) {
        await apiAddCartItem(row.menuItemId, row.qty);
      }
      const serverCart = await apiGetCart();
      cart.replace(serverCart?.items || []);
    }

    return data;
  }

  async function logout() {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setAuthNotice("");
      // optional:
      // cart.clear();
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      booting,
      authNotice,       // ✅ expose message to UI
      clearAuthNotice: () => setAuthNotice(""),
      login,
      register,
      logout,
      refreshMe,
    }),
    [user, booting, authNotice]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
