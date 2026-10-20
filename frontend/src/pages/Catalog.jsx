import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Catalog() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("TODOS");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { add } = useCart();
  const nav = useNavigate();

  useEffect(() => { 
    api.productos().then(setProductos).catch((e) => setError(e.message)); 
  }, []);

  const handleAdd = (product) => {
    if (!user) {
      nav("/cuenta");
      return;
    }
    // Aseguramos que guarde también la imagen asignada al carrito
    const assignedImage = product.imagen || product.imagen_url || product.image || `/${(product.id % 4) + 1}.webp`;
    add({
      ...product,
      id: product.id || product._id || product.nombre || product.name,
      imagen: assignedImage
    });
  };

  const visibles = filtro === "TODOS" ? productos : productos.filter((p) => p.tipo === filtro);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#f4f4f5", fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: "60px" }}>
      
      {/* Banner / Hero Section Horizontal Profesional */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "320px",
        backgroundImage: "linear-gradient(to right, rgba(9,9,11,0.9), rgba(9,9,11,0.4)), url('/1.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderBottom: "1px solid #27272a",
        display: "flex",
        alignItems: "center",
        padding: "0 60px",
        marginBottom: "40px",
        boxSizing: "border-box"
      }}>
        <div style={{ maxWidth: "600px" }}>
          <span style={{ backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#22c55e", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
            Movilidad Sostenible
          </span>
          <h1 style={{ fontSize: "42px", fontWeight: "800", margin: "16px 0 12px 0", letterSpacing: "-1px", color: "#ffffff", lineHeight: "1.1" }}>
            Muévete <span style={{ color: "#22c55e" }}>eléctrico</span>
          </h1>
          <p style={{ fontSize: "16px", color: "#a1a1aa", margin: "0", lineHeight: "1.5" }}>
            Descubre nuestra gama exclusiva de scooters y bicicletas de alta potencia diseñadas para transformar tu trayecto urbano.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        
        {/* Controles de Filtro Modernos */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", alignItems: "center" }}>
          {["TODOS", "SCOOTER", "EBIKE"].map((f) => (
            <button 
              key={f} 
              onClick={() => setFiltro(f)}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: filtro === f ? "1px solid #22c55e" : "1px solid #27272a",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                backgroundColor: filtro === f ? "#22c55e" : "#18181b",
                color: filtro === f ? "#000000" : "#d4d4d8",
                transition: "all 0.2s ease"
              }}
            >
              {f === "TODOS" ? "Todos los modelos" : f}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", padding: "16px", borderRadius: "8px", color: "#ef4444", marginBottom: "20px" }}>
            No se pudo cargar el catálogo: {error}
          </div>
        )}

        {/* Grid de Productos Profesional */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "28px" }}>
          {visibles.map((p) => {
            // Asignación dinámica de imagen basada en el ID del producto para usar 1.webp, 2.webp, etc.
            const productImg = p.imagen || p.imagen_url || p.image || `/${(p.id % 4) + 1}.webp`;

            return (
              <div 
                key={p.id || p._id} 
                style={{ 
                  backgroundColor: "#18181b", 
                  border: "1px solid #27272a", 
                  borderRadius: "16px", 
                  overflow: "hidden", 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "space-between",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#3f3f46";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#27272a";
                }}
              >
                <div>
                  {/* Contenedor de Imagen con Efecto Limpio */}
                  <div style={{ width: "100%", height: "200px", backgroundColor: "#09090b", overflow: "hidden", position: "relative" }}>
                    <img 
                      src={productImg} 
                      alt={p.nombre || p.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                      onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.target.style.transform = "scale(1.0)"}
                    />
                    <span style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", color: "#a1a1aa", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {p.tipo || "ELÉCTRICO"}
                    </span>
                  </div>

                  {/* Contenido de texto */}
                  <div style={{ padding: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                      {p.categoria || p.tipo || "e-Motion"}
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 8px 0", color: "#ffffff", lineHeight: "1.3" }}>
                      {p.nombre || p.name}
                    </h3>
                    <p style={{ color: "#a1a1aa", fontSize: "14px", margin: "0", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {p.descripcion || p.description}
                    </p>
                  </div>
                </div>

                {/* Pie de la tarjeta con Precio y Botón */}
                <div style={{ padding: "0 20px 20px 20px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "16px", borderTop: "1px solid #27272a", paddingTop: "14px" }}>
                    <span style={{ fontSize: "13px", color: "#a1a1aa" }}>Precio:</span>
                    <span style={{ fontSize: "20px", fontWeight: "800", color: "#22c55e" }}>
                      $ {Number(p.precio_cop || p.precioCop || p.price || p.precio || 0).toLocaleString()}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleAdd(p)}
                    style={{ 
                      width: "100%", 
                      backgroundColor: "#22c55e", 
                      color: "#000000", 
                      fontWeight: "700", 
                      padding: "12px", 
                      borderRadius: "10px", 
                      border: "none", 
                      cursor: "pointer",
                      fontSize: "15px",
                      transition: "background-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#16a34a"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#22c55e"}
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}