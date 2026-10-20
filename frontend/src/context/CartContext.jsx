import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartCtx = createContext();
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("emotion_cart_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const refresh = useCallback(() => {
    try {
      const saved = localStorage.getItem("emotion_cart_v1");
      setItems(saved ? JSON.parse(saved) : []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => { 
    refresh(); 
    window.addEventListener("storage", refresh);
    window.addEventListener("emotion:cart", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("emotion:cart", refresh);
    };
  }, [refresh]);

  const add = (product) => {
    const currentItems = [...items];
    const rawId = product.id || product._id || product.id_producto || product.productoId;
    const productName = product.nombre || product.name || product.title || "Producto e-Motion";
    const uniqueId = rawId ? `${rawId}-${productName}` : productName;

    const normalizedProduct = {
      ...product,
      id: uniqueId,
      nombre: productName,
      precio_cop: Number(product.precio_cop || product.precioCop || product.price || product.precio || 0),
      // Aseguramos que conserve cualquier formato de imagen que traiga el producto
      imagen: product.imagen || product.imagen_url || product.image || product.foto || product.img || product.url || "/1.webp"
    };

    const existing = currentItems.find(i => String(i.id) === String(uniqueId));

    if (existing) {
      existing.cantidad = Number(existing.cantidad || existing.qty || 1) + 1;
    } else {
      currentItems.push({ ...normalizedProduct, cantidad: 1 });
    }

    setItems(currentItems);
    localStorage.setItem("emotion_cart_v1", JSON.stringify(currentItems));
    window.dispatchEvent(new CustomEvent("emotion:cart"));
  };

  const setQty = (pid, q) => {
    const currentItems = items.map(i => String(i.id) === String(pid) ? { ...i, cantidad: Math.max(1, q), qty: Math.max(1, q) } : i);
    setItems(currentItems);
    localStorage.setItem("emotion_cart_v1", JSON.stringify(currentItems));
    window.dispatchEvent(new CustomEvent("emotion:cart"));
  };

  const remove = (pid) => {
    const currentItems = items.filter(i => String(i.id) !== String(pid));
    setItems(currentItems);
    localStorage.setItem("emotion_cart_v1", JSON.stringify(currentItems));
    window.dispatchEvent(new CustomEvent("emotion:cart"));
  };

  const total = items.reduce((s, i) => s + (Number(i.precio_cop || i.precioCop || i.price || i.precio || 0)) * (Number(i.cantidad || i.qty || 1)), 0);
  const count = items.reduce((s, i) => s + (Number(i.cantidad || i.qty || 1)), 0);

  return (
    <CartCtx.Provider value={{ items, total, count, add, setQty, remove, refresh }}>
      {children}
    </CartCtx.Provider>
  );
}