import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  const link = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-white/10" : "hover:bg-white/10"}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <nav className="flex gap-2">
          <NavLink to="/admin/menu" className={link}>Menu</NavLink>
          <NavLink to="/admin/menu/new" className={link}>Add item</NavLink>
        </nav>
      </div>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
