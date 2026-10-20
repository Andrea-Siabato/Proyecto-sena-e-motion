document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const brandSel = document.getElementById("f-brand");
  EMOTION.brands.forEach((b) => {
    const o = document.createElement("option");
    o.value = b;
    o.textContent = b;
    brandSel.appendChild(o);
  });

  if (params.get("cat")) document.getElementById("f-cat").value = params.get("cat");
  if (params.get("oferta")) document.body.dataset.offer = "1";

  const titles = {
    patinetas: "Patinetas eléctricas",
    bicicletas: "Bicicletas eléctricas",
    accesorios: "Accesorios",
    repuestos: "Repuestos",
    seguridad: "Equipamiento de seguridad",
  };

  function apply() {
    const cat = document.getElementById("f-cat").value;
    const min = Number(document.getElementById("f-min").value) || 0;
    const max = Number(document.getElementById("f-max").value) || Infinity;
    const brand = document.getElementById("f-brand").value;
    const range = Number(document.getElementById("f-range").value) || 0;
    const speed = Number(document.getElementById("f-speed").value) || 0;
    const power = Number(document.getElementById("f-power").value) || 0;
    const stock = document.getElementById("f-stock").value;
    const sort = document.getElementById("sort").value;
    const onlyOffer = params.get("oferta") === "1";

    document.getElementById("cat-title").textContent = onlyOffer
      ? "Ofertas"
      : titles[cat] || "Catálogo";

    if (document.body.dataset.page) {
      const key = onlyOffer ? "ofertas" : cat || "catalog";
      document.body.dataset.page = key === "catalog" ? "catalog" : key;
    }

    let list = EMOTION.products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (onlyOffer && !p.offer) return false;
      if (p.price < min || p.price > max) return false;
      if (brand && p.brand !== brand) return false;
      if (range && (p.rangeKm || 0) < range) return false;
      if (speed && (p.maxSpeed || 0) < speed) return false;
      if (power && (p.powerW || 0) < power) return false;
      if (stock === "in" && p.stock <= 0) return false;
      if (stock === "out" && p.stock > 0) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "new") return Number(b.new) - Number(a.new) || b.reviews - a.reviews;
      return b.sold - a.sold;
    });

    document.getElementById("cat-count").textContent = list.length + " productos";
    document.getElementById("grid").innerHTML = list.length
      ? list.map(EMOTION.ui.productCard).join("")
      : '<div class="empty">No hay productos con esos filtros.</div>';
  }

  ["f-cat", "f-min", "f-max", "f-brand", "f-range", "f-speed", "f-power", "f-stock", "sort"].forEach(
    (id) => document.getElementById(id).addEventListener("change", apply)
  );
  document.getElementById("f-reset").addEventListener("click", () => {
    location.href = "catalogo.html";
  });
  apply();
});
