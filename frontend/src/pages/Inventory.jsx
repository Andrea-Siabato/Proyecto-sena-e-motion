import { useEffect, useState } from "react";
import { api, cop } from "../services/api";

const VACIO = { nombre: "", tipo: "SCOOTER", descripcion: "", precioCop: 0, stock: 0, imagenUrl: "", activo: true };

/** CRUD de stock e inventario (solo ADMIN). */
export default function Inventory() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const cargar = () => api.productos().then(setLista).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.editarProducto(editId, form); else await api.crearProducto(form);
      setForm(VACIO); setEditId(null); setError(""); cargar();
    } catch (err) { setError(err.message); }
  };
  const set = (k, num) => (e) => setForm({ ...form, [k]: num ? +e.target.value : e.target.value });

  return (
    <>
      <h2>Inventario</h2>
      <form className="form" style={{ maxWidth: "100%", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }} onSubmit={guardar}>
        <input placeholder="Nombre" required value={form.nombre} onChange={set("nombre")} />
        <select value={form.tipo} onChange={set("tipo")}><option>SCOOTER</option><option>EBIKE</option></select>
        <input type="number" placeholder="Precio COP" value={form.precioCop} onChange={set("precioCop", true)} />
        <input type="number" placeholder="Stock" value={form.stock} onChange={set("stock", true)} />
        <input placeholder="URL imagen" value={form.imagenUrl} onChange={set("imagenUrl")} />
        <input placeholder="Descripción" value={form.descripcion} onChange={set("descripcion")} />
        <button className="btn">{editId ? "Actualizar" : "Crear"}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <table>
        <thead><tr><th>Producto</th><th>Tipo</th><th>Precio</th><th>Stock</th><th /></tr></thead>
        <tbody>
          {lista.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td><td>{p.tipo}</td><td>{cop(p.precioCop)}</td><td>{p.stock}</td>
              <td>
                <button className="btn btn-ghost" onClick={() => { setForm(p); setEditId(p.id); }}>Editar</button>{" "}
                <button className="btn btn-ghost" onClick={() => api.borrarProducto(p.id).then(cargar)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}