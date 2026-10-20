import { cop } from "../services/api";

/** Tarjeta de producto reutilizable (catalogo). */
export default function ProductCard({ producto, onAdd }) {
  const agotado = producto.stock === 0;
  return (
    <article className="card">
      <img src={producto.imagenUrl} alt={producto.nombre} loading="lazy" />
      <div className="card-body">
        <span className="tag">{producto.tipo === "EBIKE" ? "E-Bike" : "Scooter"}</span>
        <h3>{producto.nombre}</h3>
        <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>{producto.descripcion}</p>
        <span className="price">{cop(producto.precioCop)}</span>
        <button className="btn" disabled={agotado} onClick={() => onAdd(producto.id)}>
          {agotado ? "Agotado" : "Añadir al carrito"}
        </button>
      </div>
    </article>
  );
}