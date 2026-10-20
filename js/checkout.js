(function () {
  const STEPS = [
    "Información personal",
    "Dirección de envío",
    "Método de envío",
    "Método de pago",
    "Resumen",
    "Confirmación",
  ];

  function loadDraft() {
    try {
      return JSON.parse(sessionStorage.getItem(EMOTION.session.CHECKOUT_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveDraft(data) {
    const safe = { ...data };
    delete safe.cardNumber;
    delete safe.cardCvv;
    delete safe.cardExp;
    sessionStorage.setItem(EMOTION.session.CHECKOUT_KEY, JSON.stringify(safe));
  }

  let step = 0;
  let draft = loadDraft();

  function renderSummary() {
    const { lines, subtotal, shipping, total } = EMOTION.cart.totals();
    const shipCost =
      draft.shippingMethod === "express"
        ? 349
        : shipping;
    const grand = subtotal + (lines.length ? shipCost : 0);
    document.getElementById("mini-summary").innerHTML = `
      <h3>Pedido</h3>
      ${
        lines.length
          ? lines
              .map(
                (l) =>
                  `<p>${l.qty}× ${l.product.name} <span style="float:right">${EMOTION.ui.money(l.subtotal)}</span></p>`
              )
              .join("")
          : "<p>Carrito vacío</p>"
      }
      <hr>
      <p>Envío <strong style="float:right">${lines.length ? EMOTION.ui.money(shipCost) : "—"}</strong></p>
      <p>Total <strong style="float:right">${EMOTION.ui.money(grand)}</strong></p>
    `;
    return { lines, subtotal, shipCost, grand };
  }

  function nav(delta) {
    step = Math.max(0, Math.min(STEPS.length - 1, step + delta));
    draw();
  }

  function draw() {
    document.getElementById("steps").innerHTML = STEPS.map(
      (s, i) => `<span class="${i === step ? "is-on" : ""}">${i + 1}. ${s}</span>`
    ).join("");
    const root = document.getElementById("step-root");
    const { lines, grand } = renderSummary();

    if (!lines.length && step < 5) {
      root.innerHTML = `<div class="empty"><p>Agrega productos antes de pagar.</p><a class="btn btn-primary" href="catalogo.html">Catálogo</a></div>`;
      return;
    }

    if (step === 0) {
      root.innerHTML = formWrap(
        `
        <label>Nombre <input name="firstName" required value="${esc(draft.firstName)}"></label>
        <label>Apellidos <input name="lastName" required value="${esc(draft.lastName)}"></label>
        <label>Correo <input type="email" name="email" required value="${esc(draft.email)}"></label>
        <label>Teléfono <input name="phone" required value="${esc(draft.phone)}"></label>
      `,
        "Continuar"
      );
    } else if (step === 1) {
      root.innerHTML = formWrap(
        `
        <label class="full">Calle y número <input name="street" required value="${esc(draft.street)}"></label>
        <label>Colonia <input name="colony" required value="${esc(draft.colony)}"></label>
        <label>CP <input name="zip" required value="${esc(draft.zip)}"></label>
        <label>Ciudad <input name="city" required value="${esc(draft.city)}"></label>
        <label>Estado <input name="state" required value="${esc(draft.state)}"></label>
      `,
        "Continuar"
      );
    } else if (step === 2) {
      root.innerHTML = formWrap(
        `
        <label class="full"><input type="radio" name="shippingMethod" value="standard" ${draft.shippingMethod !== "express" ? "checked" : ""}> Estándar (3–5 días) · ${EMOTION.cart.totals().shipping ? EMOTION.ui.money(EMOTION.store.shippingFlat) : "Gratis"}</label>
        <label class="full"><input type="radio" name="shippingMethod" value="express" ${draft.shippingMethod === "express" ? "checked" : ""}> Express (24–48 h) · ${EMOTION.ui.money(349)}</label>
      `,
        "Continuar"
      );
    } else if (step === 3) {
      root.innerHTML = formWrap(
        `
        <p class="full note">Los datos de tarjeta se envían a la pasarela (PCI). e-Motion no los guarda en localStorage ni sessionStorage.</p>
        <label class="full">Titular <input name="cardName" required autocomplete="cc-name" value="${esc(draft.cardName)}"></label>
        <label class="full">Número de tarjeta <input name="cardNumber" required inputmode="numeric" autocomplete="cc-number" placeholder="ACCT-000015" maxlength="19"></label>
        <label>Vencimiento <input name="cardExp" required autocomplete="cc-exp" placeholder="MM/AA"></label>
        <label>CVV <input name="cardCvv" required inputmode="numeric" autocomplete="cc-csc" maxlength="4"></label>
      `,
        "Continuar"
      );
    } else if (step === 4) {
      root.innerHTML = `
        <div class="form-grid">
          <div class="full">
            <h3>Revisa tu pedido</h3>
            <p>${esc(draft.firstName)} ${esc(draft.lastName)} · ${esc(draft.email)}</p>
            <p>${esc(draft.street)}, ${esc(draft.colony)}, ${esc(draft.zip)} ${esc(draft.city)}, ${esc(draft.state)}</p>
            <p>Envío: ${draft.shippingMethod === "express" ? "Express" : "Estándar"}</p>
            <p>Pago: tarjeta terminación ${esc(draft.cardLast4 || "••••")}</p>
            <p><strong>Total ${EMOTION.ui.money(grand)}</strong></p>
          </div>
          <div class="full" style="display:flex;gap:8px">
            <button class="btn btn-ghost" type="button" data-back>Atrás</button>
            <button class="btn btn-primary" type="button" id="pay">Confirmar y pagar</button>
          </div>
        </div>`;
      document.getElementById("pay").onclick = () => {
        const orderId = "EM-" + Date.now().toString().slice(-8);
        sessionStorage.setItem(
          "emotion_last_order",
          JSON.stringify({
            orderId,
            total: grand,
            email: draft.email,
            items: lines.map((l) => ({ id: l.id, qty: l.qty, name: l.product.name })),
          })
        );
        EMOTION.cart.clear();
        sessionStorage.removeItem(EMOTION.session.CHECKOUT_KEY);
        step = 5;
        draw();
      };
    } else {
      const last = JSON.parse(sessionStorage.getItem("emotion_last_order") || "{}");
      root.innerHTML = `
        <div class="empty">
          <h2>Pedido confirmado</h2>
          <p>Número <strong>${last.orderId || "EM-000"}</strong></p>
          <p>Enviaremos el acuse a ${last.email || "tu correo"} cuando el backend esté activo.</p>
          <a class="btn btn-primary" href="index.html">Volver al inicio</a>
        </div>`;
    }

    root.querySelector("[data-back]")?.addEventListener("click", () => nav(-1));
    root.querySelector("form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const next = Object.fromEntries(fd.entries());
      if (step === 3) {
        const num = String(next.cardNumber || "").replace(/\s+/g, "");
        if (num.length < 13) {
          EMOTION.ui.toast("Revisa el número de tarjeta");
          return;
        }
        draft.cardLast4 = num.slice(-4);
        draft.cardName = next.cardName;
        delete next.cardNumber;
        delete next.cardCvv;
        delete next.cardExp;
      }
      draft = { ...draft, ...next };
      saveDraft(draft);
      nav(1);
    });
  }

  function formWrap(fields, label) {
    return `
      <form class="form-grid">
        ${fields}
        <div class="full" style="display:flex;gap:8px">
          ${step > 0 ? '<button class="btn btn-ghost" type="button" data-back>Atrás</button>' : ""}
          <button class="btn btn-primary" type="submit">${label}</button>
        </div>
      </form>`;
  }

  function esc(v) {
    return String(v || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  document.addEventListener("DOMContentLoaded", draw);
})();
