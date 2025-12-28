import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const location = useLocation();

  // ✅ Close drawer automatically on checkout/pay pages
  useEffect(() => {
    if (location.pathname === "/checkout" || location.pathname === "/pay") {
      setCartOpen(false);
    }
  }, [location.pathname]);

  const cartCount = items.reduce((s, it) => s + it.qty, 0);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive ? "bg-emerald-100 text-emerald-800" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <Link to="/" className="font-semibold tracking-tight text-gray-900">
            Saarah Eats
          </Link>

          <nav className="ml-auto flex items-center gap-1">
            <NavLink to="/menu" className={linkClass}>Menu</NavLink>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              Cart <span className="ml-1 text-gray-500">({cartCount})</span>
            </button>

            {user && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin/menu" className={linkClass}>Admin</NavLink>}

            {!user ? (
              <NavLink to="/login" className={linkClass}>Login</NavLink>
            ) : (
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
