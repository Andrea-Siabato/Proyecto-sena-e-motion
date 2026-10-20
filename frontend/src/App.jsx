import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Inventory from "./pages/Inventory";
import { useAuth } from "./context/AuthContext";

/** Ruta protegida. OJO: la restriccion de ADMIN debe reforzarse tambien en el backend. */
const Private = ({ children, admin }) => {
  const { user } = useAuth();
  if (!user || (admin && user.rol !== "ADMIN")) return <Navigate to="/cuenta" />;
  return children;
};

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="/carrito" element={<Private><Cart /></Private>} />
          <Route path="/checkout" element={<Private><Checkout /></Private>} />
          <Route path="/inventario" element={<Private admin><Inventory /></Private>} />
        </Routes>
      </main>
    </>
  );
}