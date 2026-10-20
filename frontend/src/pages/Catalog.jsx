import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

// Datos de respaldo para que Vercel siempre los muestre
const PRODUCTOS_LOCALES = [
  {
    id: 1,
    nombre: "Scooter Eléctrico e-Motion Pro X",
    categoria: "SCOOTER",
    precio_cop: 2850000,
    descripcion: "Motor de 500W, autonomía de 45 km, velocidad máxima 35 km/h.",
    imagen_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    nombre: "Bicicleta Eléctrica e-Urban Sport",
    categoria: "EBIKE",
    precio_cop: 4200000,
    descripcion: "Batería de litio extraíble, asistencia de pedaleo de 5 niveles, frenos de disco hidráulicos.",
    imagen_url: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    nombre: "Scooter Utilitario e-City Lite",
    categoria: "SCOOTER",
    precio_cop: 1850000,
    descripcion: "Compacto y plegable, ideal para el tráfico urbano diario.",
    imagen_url: "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&w=600&q=80"
  }
];

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/productos');
        if (!res.ok) throw new Error('Servidor no disponible');
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.warn("Usando catálogo de respaldo para entorno desplegado:", error);
        // Si falla la API local, usa los datos de respaldo
        setProductos(PRODUCTOS_LOCALES);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: '40px' }}>Cargando catálogo...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#fff' }}>
      <h2 style={{ color: '#22c55e', fontSize: '28px', marginBottom: '20px' }}>Catálogo e-Motion</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {productos.map((prod) => (
          <div key={prod.id} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', overflow: 'hidden', padding: '16px' }}>
            <img src={prod.imagen_url} alt={prod.nombre} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
            <h3 style={{ fontSize: '18px', margin: '12px 0 6px' }}>{prod.nombre}</h3>
            <p style={{ color: '#a1a1aa', fontSize: '14px', height: '40px', overflow: 'hidden' }}>{prod.descripcion}</p>
            <p style={{ color: '#22c55e', fontSize: '20px', fontWeight: '800', margin: '12px 0' }}>$ {Number(prod.precio_cop).toLocaleString()} COP</p>
            <button onClick={() => addToCart && addToCart(prod)} style={{ width: '100%', padding: '10px', backgroundColor: '#22c55e', color: '#000', fontWeight: '700', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}