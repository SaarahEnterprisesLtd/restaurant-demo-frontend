// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Payment from "./pages/Payment";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLayout from "./pages/Admin/AdminLayout";
import MenuList from "./pages/Admin/MenuList";
import MenuNew from "./pages/Admin/MenuNew";
import MenuEdit from "./pages/Admin/MenuEdit";

// ✅ ADD THIS
import AuthNotice from "./components/AuthNotice";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* ✅ ADD THIS */}
      <AuthNotice />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pay" element={<Payment />} />

        {/* User-protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/orders" element={<Orders />} />
        </Route>

        {/* Admin-protected */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="menu" element={<MenuList />} />
            <Route path="menu/new" element={<MenuNew />} />
            <Route path="menu/:id" element={<MenuEdit />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={<div className="p-10 text-center text-gray-600">Not found</div>}
        />
      </Routes>
    </div>
  );
}
