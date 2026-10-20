import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

/** Formulario de inscripcion / registro de clientes. */
export default function Register() {
  const [f, setF] = useState({ nombre: "", email: "", password: "", telefono: "", direccion: "" });
  const [error, setError] = useState("");
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try { await api.registro(f); nav("/cuenta"); } catch (err) { setError(err.message); }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Crear cuenta</h2>
      <input placeholder="Nombre completo" required value={f.nombre} onChange={set("nombre")} />
      <input type="email" placeholder="Correo" required value={f.email} onChange={set("email")} />
      <input type="password" placeholder="Contraseña (mín. 8)" minLength={8} required value={f.password} onChange={set("password")} />
      <input placeholder="Teléfono" value={f.telefono} onChange={set("telefono")} />
      <input placeholder="Dirección de envío" value={f.direccion} onChange={set("direccion")} />
      {error && <p className="error">{error}</p>}
      <button className="btn">Registrarme</button>
    </form>
  );
}