function renderCart() {
  const root = document.getElementById("cart-root");
  const { lines, subtotal, shipping, total } = EMOTION.cart.totals();
  if (!lines.length) {
    root.innerHTML = `<div class="empty"><p>Tu carrito está vacío.</p><a class="btn btn-primary" href="catalogo.html">Ir al catálogo</a></div>`;
    return;
  }
  root.innerHTML = `
    <div style="overflow:auto">
      <table class="cart-table">
        <thead>
          <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
        </thead>
        <tbody>
          ${lines
            .map(
              (l) => `
            <tr>
              <td>
                <div class="cart-item">
                  <img src="${l.product.images[0]}" alt="${l.product.name}">
                  <div>
                    <strong>${l.product.name}</strong>
                    <div class="note">${l.product.brand}</div>
                  </div>
                </div>
              </td>
              <td>${EMOTION.ui.money(l.product.price)}</td>
              <td>
                <input type="number" min="1" max="${l.product.stock}" value="${l.qty}" data-qty="${l.id}" style="width:72px;height:40px;border-radius:10px;border:1px solid var(--line);padding:0 8px">
              </td>
              <td>${EMOTION.ui.money(l.subtotal)}</td>
              <td><button class="btn btn-ghost" data-remove="${l.id}">Eliminar</button></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <aside class="summary">
      <h3>Resumen</h3>
      <p>Subtotal <strong style="float:right">${EMOTION.ui.money(subtotal)}</strong></p>
      <p>Envío <strong style="float:right">${shipping ? EMOTION.ui.money(shipping) : "Gratis"}</strong></p>
      <p class="note">Gratis desde ${EMOTION.ui.money(EMOTION.store.shippingFreeFrom)}</p>
      <hr>
      <p>Total <strong style="float:right">${EMOTION.ui.money(total)}</strong></p>
      <a class="btn btn-ghost" href="catalogo.html" style="width:100%;margin-top:12px">Continuar compra</a>
      <a class="btn btn-primary" href="checkout.html" style="width:100%;margin-top:8px">Finalizar compra</a>
    </aside>
  `;

  root.querySelectorAll("[data-qty]").forEach((input) => {
    input.addEventListener("change", () => {
      EMOTION.cart.setQty(input.getAttribute("data-qty"), Number(input.value));
      renderCart();
    });
  });
  root.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      EMOTION.cart.remove(btn.getAttribute("data-remove"));
      renderCart();
    });
  });
}

document.addEventListener("DOMContentLoaded", renderCart);
