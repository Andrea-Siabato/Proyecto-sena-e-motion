// Unico punto de contacto con el backend: si cambia la API, solo se edita este archivo.
const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `Error ${res.status}`);
  }
  return res.status === 204 ? null : res.json().catch(() => null);
}

export const api = {
  // Productos / inventario
  productos: () => request("/productos"),
  crearProducto: (p) => request("/productos", { method: "POST", body: p }),
  editarProducto: (id, p) => request(`/productos/${id}`, { method: "PUT", body: p }),
  borrarProducto: (id) => request(`/productos/${id}`, { method: "DELETE" }),
  // Clientes
  registro: (d) => request("/clientes/registro", { method: "POST", body: d }),
  login: (d) => request("/clientes/login", { method: "POST", body: d }),
  editarCliente: (id, d) => request(`/clientes/${id}`, { method: "PUT", body: d }),
  borrarCliente: (id) => request(`/clientes/${id}`, { method: "DELETE" }),
  // Carrito
  carrito: (cid) => request(`/carrito/${cid}`),
  agregar: (cid, productoId, cantidad = 1) => request(`/carrito/${cid}`, { method: "POST", body: { productoId, cantidad } }),
  actualizar: (cid, productoId, cantidad) => request(`/carrito/${cid}`, { method: "PUT", body: { productoId, cantidad } }),
  quitar: (cid, productoId) => request(`/carrito/${cid}/${productoId}`, { method: "DELETE" }),
  checkout: (cid, tarjeta) => request(`/carrito/${cid}/checkout`, { method: "POST", body: { tarjeta } }),
  // API externa (via backend)
  tasa: () => request("/tasa"),
};

/** Formatea un numero como pesos colombianos. */
export const cop = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);