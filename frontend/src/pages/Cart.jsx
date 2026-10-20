import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items: cartItems = [], remove: removeFromCart, setQty: updateQuantity, total } = useCart();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", color: "#ffffff", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "24px", letterSpacing: "-0.5px" }}>
        Tu Carrito de Compras
      </h2>

      {(!cartItems || cartItems.length === 0) ? (
        <div style={{ backgroundColor: "#18181b", padding: "40px", borderRadius: "12px", textAlign: "center", border: "1px solid #27272a" }}>
          <p style={{ color: "#a1a1aa", fontSize: "18px" }}>Tu carrito está vacío.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>
          
          {/* Lista de productos */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {cartItems.map((i, index) => {
              const precioUnitario = Number(i.precio_cop || i.precioCop || i.price || i.precio || 0);
              const cantidad = Number(i.cantidad || i.qty || 1);
              // Validamos todas las posibles variantes de la ruta de la imagen
              const imagen = i.imagen || i.imagen_url || i.image || i.foto || i.img || i.url || (i.images && i.images[0]) || "/1.webp";
              const nombre = i.nombre || i.name || "Producto e-Motion";

              return (
                <div
                  key={i.id || index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#18181b",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #27272a",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <img
                      src={imagen}
                      alt={nombre}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/1.webp";
                      }}
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        backgroundColor: "#27272a",
                        border: "1px solid #3f3f46"
                      }}
                    />
                    <div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600", color: "#ffffff" }}>{nombre}</h3>
                      <p style={{ margin: 0, fontSize: "16px", color: "#22c55e", fontWeight: "700" }}>
                        $ {precioUnitario.toLocaleString()} <span style={{ fontSize: "12px", color: "#a1a1aa", fontWeight: "normal" }}>c/u</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "12px", color: "#a1a1aa" }}>Cant.</span>
                      <input
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => updateQuantity(i.id, parseInt(e.target.value) || 1)}
                        style={{
                          width: "60px",
                          backgroundColor: "#27272a",
                          color: "#ffffff",
                          textAlign: "center",
                          borderRadius: "6px",
                          padding: "6px",
                          border: "1px solid #3f3f46",
                          fontSize: "15px",
                          outline: "none"
                        }}
                      />
                    </div>
                    <button
                      onClick={() => removeFromCart(i.id)}
                      style={{
                        backgroundColor: "transparent",
                        color: "#ef4444",
                        border: "1px solid #ef4444",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.target.style.backgroundColor = "#ef4444"; e.target.style.color = "#ffffff"; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = "transparent"; e.target.style.color = "#ef4444"; }}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Panel Lateral de Resumen */}
          <div style={{ backgroundColor: "#18181b", padding: "24px", borderRadius: "12px", border: "1px solid #27272a", position: "sticky", top: "20px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "600", borderBottom: "1px solid #27272a", paddingBottom: "12px" }}>
              Resumen del Pedido
            </h3>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#a1a1aa" }}>
              <span>Productos ({cartItems.length}):</span>
              <span>$ {Number(total).toLocaleString()}</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", color: "#a1a1aa" }}>
              <span>Envío:</span>
              <span style={{ color: "#22c55e", fontWeight: "600" }}>Gratis</span>
            </div>

            <div style={{ borderTop: "1px solid #27272a", paddingTop: "16px", marginBottom: "24px" }}>
              <span style={{ fontSize: "14px", color: "#a1a1aa", display: "block" }}>Total a pagar:</span>
              <span style={{ fontSize: "28px", fontWeight: "800", color: "#22c55e", display: "block", marginTop: "4px" }}>
                $ {Number(total).toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              style={{
                width: "100%",
                backgroundColor: "#22c55e",
                color: "#000000",
                fontWeight: "700",
                padding: "14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                transition: "transform 0.1s, backgroundColor 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#16a34a"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#22c55e"}
            >
              Proceder al Pago →
            </button>
          </div>

        </div>
      )}
    </div>
  );
}