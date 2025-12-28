import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthNotice() {
  const { user, booting } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // show only when boot finished AND user is null
    if (!booting && !user) {
      setShow(true);

      // auto-hide after 4s
      const t = setTimeout(() => setShow(false), 4000);
      return () => clearTimeout(t);
    }
  }, [booting, user]);

  if (!show) return null;

  return (
    <div className="sticky top-0 z-50 bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-sm px-4 py-2 text-center">
      Session expired. Please log in again.
    </div>
  );
}

