import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="navbar">
      <Link to="/" className="logo">e-<span>Motion</span></Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/">Catálogo</Link>
        {user?.rol === "ADMIN" && <Link to="/inventario">Inventario</Link>}
        <Link to="/carrito">Carrito ({count})</Link>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: 'auto', overflow: 'visible' }}>
            <Link 
              to="/cuenta" 
              style={{ 
                color: '#00ff66', 
                textDecoration: 'none', 
                fontWeight: 'bold',
                display: 'inline-block',
                maxWidth: 'none',
                overflow: 'visible',
                textOverflow: 'clip',
                whiteSpace: 'nowrap'
              }}
            >
              Hola, {user.nombre || 'Usuario'}
            </Link>
            <button 
              className="btn btn-ghost" 
              onClick={logout}
              style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Salir
            </button>
          </div>
        ) : (
          <>
            <Link to="/cuenta">Ingresar</Link>
            <Link to="/registro" className="btn">Registrarme</Link>
          </>
        )}
      </nav>
    </header>
  );
}