import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const PRODUCTOS_INICIALES = [
  {
    id: 1,
    nombre: "E-Bike All-Terrain X Trek",
    descripcion: "Potencia superior y suspensión doble para trayectos exigentes.",
    precioCop: 6500000,
    imagen_url: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    nombre: "Scooter Urban Lite Xiaomi",
    descripcion: "Modelo ultraligero y plegable para desplazamientos diarios.",
    precioCop: 1850000,
    imagen_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    nombre: "E-Bike City Commuter Specialized",
    descripcion: "Bicicleta eléctrica asistida para movilidad rápida y ecológica en la ciudad.",
    precioCop: 4800000,
    imagen_url: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=600&q=80"
  }
];

export default function Catalog() {
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);
  const cartContext = useCart();
  const addToCart = cartContext?.addToCart;

  useEffect(() => {
    fetch('http://localhost:8080/api/productos')
      .then(res => {
        if (!res.ok) throw new Error("API offline");
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) setProductos(data);
      })
      .catch(() => {
        console.log("Cargando catálogo estático de respaldo para Vercel.");
      });
  }, []);

  return (
    <div style={{ backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', padding: '30px 40px', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '24px', color: '#22c55e' }}>Nuestros Modelos</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {productos.map((prod) => {
          const precioFinal = Number(prod.precioCop || prod.precio_cop || prod.precio || prod.price || 0);

          return (
            <div key={prod.id} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <img 
                  src={prod.imagen_url || prod.imagenUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80"} 
                  alt={prod.nombre} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', marginBottom: '14px' }} 
                />
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#fff', fontWeight: '700' }}>{prod.nombre}</h3>
                <p style={{ color: '#a1a1aa', fontSize: '13px', marginBottom: '16px', lineHeight: '1.4' }}>{prod.descripcion}</p>
              </div>

              <div>
                <p style={{ color: '#22c55e', fontSize: '22px', fontWeight: '800', margin: '0 0 14px 0' }}>
                  $ {precioFinal.toLocaleString()} COP
                </p>
                <button 
                  onClick={() => addToCart && addToCart(prod)} 
                  style={{ width: '100%', padding: '12px', backgroundColor: '#22c55e', color: '#000', fontWeight: '800', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}