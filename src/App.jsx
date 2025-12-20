import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <>
      <nav style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/menu">Menu</Link> |{" "}
        <Link to="/orders">My Orders</Link> |{" "}
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}
