document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id");
  const p = EMOTION.products.find((x) => x.id === id) || EMOTION.products[0];
  const pct = EMOTION.ui.discountPct(p);
  const out = p.stock <= 0;
  document.title = p.name + " · e-Motion";

  const root = document.getElementById("pdp");
  root.innerHTML = `
    <article class="pdp">
      <div>
        <div class="gallery-main"><img id="main-photo" src="${p.images[0]}" alt="${p.name}"></div>
        <div class="thumbs">
          ${p.images
            .map(
              (src, i) =>
                `<button type="button" class="${i === 0 ? "is-on" : ""}" data-src="${src}"><img src="${src}" alt="Vista ${i + 1} de ${p.name}"></button>`
            )
            .join("")}
        </div>
      </div>
      <div>
        <p class="card-brand">${p.brand} · SKU ${p.sku}</p>
        <h1>${p.name}</h1>
        <p class="rating"><span class="stars">${EMOTION.ui.stars(p.rating)}</span> ${p.rating} · ${p.reviews} reseñas</p>
        <div class="price-row" style="margin:12px 0 8px">
          <strong style="font-size:1.6rem">${EMOTION.ui.money(p.price)}</strong>
          ${p.compareAt ? `<s>${EMOTION.ui.money(p.compareAt)}</s>` : ""}
          ${pct ? `<span class="badge-sale" style="position:static">-${pct}%</span>` : ""}
        </div>
        <p>${p.description}</p>
        <p><strong>Disponibilidad:</strong> ${out ? "Agotado" : p.stock + " unidades"}</p>
        <p><strong>Garantía:</strong> ${p.warranty}</p>
        <div class="specs-mini" style="margin:12px 0">${EMOTION.ui.specPills(p)}</div>
        <div class="qty">
          <button class="btn btn-ghost" type="button" id="q-minus">−</button>
          <input id="qty" type="number" min="1" max="${Math.max(p.stock, 1)}" value="1">
          <button class="btn btn-ghost" type="button" id="q-plus">+</button>
        </div>
        <div class="card-actions" style="max-width:420px;margin-top:16px">
          <button class="btn btn-primary" ${out ? "disabled" : ""} id="add">Agregar al carrito</button>
          <button class="btn btn-dark" ${out ? "disabled" : ""} id="buy">Comprar ahora</button>
        </div>
      </div>
    </article>
    <section class="section">
      <h2>Especificaciones técnicas</h2>
      <table class="spec-table">
        <tr><td>Autonomía</td><td>${p.rangeKm ? p.rangeKm + " km" : "—"}</td></tr>
        <tr><td>Velocidad máxima</td><td>${p.maxSpeed ? p.maxSpeed + " km/h" : "—"}</td></tr>
        <tr><td>Potencia</td><td>${p.powerW ? p.powerW + " W" : "—"}</td></tr>
        <tr><td>Tiempo de carga</td><td>${p.chargeH ? p.chargeH + " h" : "—"}</td></tr>
        <tr><td>Peso</td><td>${p.weightKg} kg</td></tr>
        <tr><td>Capacidad máxima</td><td>${p.maxLoadKg ? p.maxLoadKg + " kg" : "—"}</td></tr>
        <tr><td>Garantía</td><td>${p.warranty}</td></tr>
        ${p.specs.map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join("")}
      </table>
    </section>
    <section class="section" style="padding-top:0">
      <h2>También te puede interesar</h2>
      <div class="grid-products">
        ${EMOTION.products
          .filter((x) => x.category === p.category && x.id !== p.id)
          .slice(0, 3)
          .map(EMOTION.ui.productCard)
          .join("")}
      </div>
    </section>
  `;

  root.querySelectorAll(".thumbs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("main-photo").src = btn.dataset.src;
      root.querySelectorAll(".thumbs button").forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
    });
  });

  const qty = document.getElementById("qty");
  document.getElementById("q-minus").onclick = () => {
    qty.value = Math.max(1, Number(qty.value) - 1);
  };
  document.getElementById("q-plus").onclick = () => {
    qty.value = Math.min(Number(qty.max), Number(qty.value) + 1);
  };
  document.getElementById("add").onclick = () => EMOTION.cart.add(p.id, Number(qty.value));
  document.getElementById("buy").onclick = () => {
    EMOTION.cart.add(p.id, Number(qty.value));
    location.href = "checkout.html";
  };
});
