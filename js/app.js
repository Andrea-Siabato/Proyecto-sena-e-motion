(function () {
  const CART_KEY = "emotion_cart_v1";
  const USER_KEY = "emotion_user_v1";
  const CHECKOUT_KEY = "emotion_checkout_v1";

  function money(n) {
    return new Intl.NumberFormat(EMOTION.store.locale, {
      style: "currency",
      currency: EMOTION.store.currency,
      maximumFractionDigits: 0,
    }).format(n);
  }

  function discountPct(p) {
    if (!p.compareAt || p.compareAt <= p.price) return 0;
    return Math.round((1 - p.price / p.compareAt) * 100);
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartCount();
    window.dispatchEvent(new CustomEvent("emotion:cart"));
  }

  function cartCount() {
    return getCart().reduce((s, i) => s + i.qty, 0);
  }

  function cartLines() {
    return getCart()
      .map((line) => {
        const product = EMOTION.products.find((p) => p.id === line.id);
        if (!product) return null;
        return { ...line, product, subtotal: product.price * line.qty };
      })
      .filter(Boolean);
  }

  function cartTotals() {
    const lines = cartLines();
    const subtotal = lines.reduce((s, l) => s + l.subtotal, 0);
    const shipping =
      subtotal === 0
        ? 0
        : subtotal >= EMOTION.store.shippingFreeFrom
          ? 0
          : EMOTION.store.shippingFlat;
    return { lines, subtotal, shipping, total: subtotal + shipping };
  }

  function addToCart(id, qty) {
    const product = EMOTION.products.find((p) => p.id === id);
    if (!product) return;
    if (product.stock <= 0) {
      toast("Producto agotado");
      return;
    }
    const items = getCart();
    const found = items.find((i) => i.id === id);
    const nextQty = (found ? found.qty : 0) + (qty || 1);
    if (nextQty > product.stock) {
      toast("No hay más piezas disponibles");
      return;
    }
    if (found) found.qty = nextQty;
    else items.push({ id, qty: qty || 1 });
    setCart(items);
    toast("Añadido al carrito");
  }

  function setQty(id, qty) {
    const product = EMOTION.products.find((p) => p.id === id);
    const items = getCart()
      .map((i) => {
        if (i.id !== id) return i;
        const q = Math.max(1, Math.min(product ? product.stock : 1, qty));
        return { ...i, qty: q };
      })
      .filter((i) => i.qty > 0);
    setCart(items);
  }

  function removeFromCart(id) {
    setCart(getCart().filter((i) => i.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function updateCartCount() {
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      const n = cartCount();
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toast._id);
    toast._id = setTimeout(() => t.classList.remove("is-on"), 2200);
  }

  function stars(n) {
    const full = Math.round(n);
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function productUrl(id) {
    return "producto.html?id=" + encodeURIComponent(id);
  }

  function catalogUrl(params) {
    const q = new URLSearchParams(params);
    return "catalogo.html" + (q.toString() ? "?" + q.toString() : "");
  }

  function specPills(p) {
    const bits = [];
    if (p.rangeKm) bits.push(`<span>${p.rangeKm} km</span>`);
    if (p.maxSpeed) bits.push(`<span>${p.maxSpeed} km/h</span>`);
    if (p.powerW) bits.push(`<span>${p.powerW} W</span>`);
    return bits.join("");
  }

  function productCard(p) {
    const pct = discountPct(p);
    const out = p.stock <= 0;
    return `
      <article class="card">
        <a class="card-media" href="${productUrl(p.id)}">
          ${pct ? `<span class="badge-sale">-${pct}%</span>` : ""}
          ${out ? `<span class="badge-out">Agotado</span>` : p.new ? `<span class="badge-new">Nuevo</span>` : ""}
          <img src="${p.images[0]}" alt="${p.name} de ${p.brand}" width="640" height="480" loading="lazy">
        </a>
        <div class="card-body">
          <p class="card-brand">${p.brand}</p>
          <h3 class="card-title"><a href="${productUrl(p.id)}">${p.name}</a></h3>
          <p class="rating"><span class="stars">${stars(p.rating)}</span> ${p.rating} · ${p.reviews} reseñas</p>
          <div class="specs-mini">${specPills(p)}</div>
          <div class="price-row">
            <strong>${money(p.price)}</strong>
            ${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" ${out ? "disabled" : ""} data-add="${p.id}">Agregar al carrito</button>
            <a class="btn btn-ghost" href="${productUrl(p.id)}">Ver producto</a>
          </div>
        </div>
      </article>`;
  }

  function headerHTML(page) {
    const nav = [
      ["index.html", "Inicio", "home"],
      ["catalogo.html?cat=patinetas", "Patinetas", "patinetas"],
      ["catalogo.html?cat=bicicletas", "Bicicletas", "bicicletas"],
      ["catalogo.html?cat=accesorios", "Accesorios", "accesorios"],
      ["catalogo.html?oferta=1", "Ofertas", "ofertas"],
      ["contacto.html", "Contacto", "contacto"],
    ];
    return `
      <div class="topbar">
        <div class="wrap topbar-inner">
          <span>Envío protegido · baterías de litio certificadas</span>
          <span>Envío gratis desde ${money(EMOTION.store.shippingFreeFrom)}</span>
          <span>Hasta 12 meses de garantía en vehículos</span>
        </div>
      </div>
      <header class="header">
        <div class="wrap header-inner">
          <a class="logo" href="index.html" aria-label="e-Motion inicio">
            <span class="logo-mark" aria-hidden="true"></span>
            e-Motion
          </a>
          <nav class="nav" aria-label="Principal">
            ${nav
              .map(
                ([href, label, key]) =>
                  `<a href="${href}" ${page === key ? 'aria-current="page"' : ""}>${label}</a>`
              )
              .join("")}
          </nav>
          <div class="header-tools">
            <button class="icon-btn" data-open-search aria-label="Buscar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>
            </button>
            <a class="icon-btn" href="cuenta.html" aria-label="Cuenta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6"/></svg>
            </a>
            <a class="icon-btn cart-btn" href="carrito.html" aria-label="Carrito">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 7h15l-1.5 9h-12z"/><path d="M6 7L5 3H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>
              <span class="cart-badge" data-cart-count hidden>0</span>
            </a>
            <button class="icon-btn menu-btn" data-toggle-nav aria-label="Menú">☰</button>
          </div>
        </div>
      </header>
      <div class="search-panel" hidden>
        <div class="wrap search-inner">
          <input type="search" id="site-search" placeholder="Busca patinetas, bicicletas, cascos…" autocomplete="off">
          <div id="search-results" class="search-results"></div>
        </div>
      </div>`;
  }

  function footerHTML() {
    return `
      <footer class="footer">
        <div class="wrap footer-grid">
          <div>
            <a class="logo light" href="index.html"><span class="logo-mark"></span> e-Motion</a>
            <p class="footer-lead">Movilidad eléctrica urbana con respaldo técnico. Prototipo listo para backend, autenticación y pasarela de pagos.</p>
          </div>
          <div>
            <h4>Tienda</h4>
            <a href="catalogo.html?cat=patinetas">Patinetas</a>
            <a href="catalogo.html?cat=bicicletas">Bicicletas</a>
            <a href="catalogo.html?cat=accesorios">Accesorios</a>
            <a href="catalogo.html?cat=repuestos">Repuestos</a>
            <a href="catalogo.html?cat=seguridad">Seguridad</a>
          </div>
          <div>
            <h4>Soporte</h4>
            <a href="contacto.html">Contacto</a>
            <a href="index.html#faq">Preguntas frecuentes</a>
            <a href="cuenta.html">Mi cuenta</a>
            <a href="carrito.html">Carrito</a>
          </div>
          <div>
            <h4>Newsletter</h4>
            <p>Novedades y mantenimiento. Sin spam.</p>
            <form class="news-form" data-news>
              <input type="email" name="email" required placeholder="tu@email.com">
              <button class="btn btn-primary" type="submit">Unirme</button>
            </form>
          </div>
        </div>
        <div class="wrap footer-bottom">
          <p>© ${new Date().getFullYear()} e-Motion. Prototipo comercial.</p>
          <p>Pagos tokenizados · No guardamos tarjetas en el navegador</p>
        </div>
      </footer>`;
  }

  function currentNav() {
    const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const q = new URLSearchParams(location.search);
    if (file.includes("index") || file === "") return "home";
    if (file.includes("contacto")) return "contacto";
    if (q.get("oferta") === "1") return "ofertas";
    const cat = q.get("cat");
    if (cat === "patinetas" || cat === "bicicletas" || cat === "accesorios") return cat;
    return document.body.dataset.page || "";
  }

  function mountChrome() {
    const page = currentNav();
    const root = document.getElementById("chrome");
    if (root) {
      root.innerHTML = headerHTML(page);
    }
    const foot = document.getElementById("site-footer");
    if (foot) foot.innerHTML = footerHTML();
    updateCartCount();

    document.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      if (add) addToCart(add.getAttribute("data-add"), 1);
      if (e.target.closest("[data-toggle-nav]")) {
        document.querySelector(".nav")?.classList.toggle("is-open");
      }
      if (e.target.closest("[data-open-search]")) {
        const panel = document.querySelector(".search-panel");
        panel.hidden = !panel.hidden;
        if (!panel.hidden) document.getElementById("site-search")?.focus();
      }
    });

    const search = document.getElementById("site-search");
    if (search) {
      search.addEventListener("input", () => {
        const q = search.value.trim().toLowerCase();
        const box = document.getElementById("search-results");
        if (!q) {
          box.innerHTML = "";
          return;
        }
        const hits = EMOTION.products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.category.includes(q)
          )
          .slice(0, 6);
        box.innerHTML = hits.length
          ? hits
              .map(
                (p) =>
                  `<a href="${productUrl(p.id)}"><img src="${p.images[0]}" alt=""><span>${p.brand} ${p.name}</span><strong>${money(p.price)}</strong></a>`
              )
              .join("")
          : "<p>Sin resultados</p>";
      });
    }

    document.querySelector("[data-news]")?.addEventListener("submit", (e) => {
      e.preventDefault();
      toast("Te avisaremos cuando el backend esté conectado");
      e.target.reset();
    });
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  }

  function setUser(u) {
    if (!u) localStorage.removeItem(USER_KEY);
    else localStorage.setItem(USER_KEY, JSON.stringify(u));
  }

  EMOTION.ui = {
    money,
    discountPct,
    stars,
    productCard,
    productUrl,
    catalogUrl,
    specPills,
    toast,
    mountChrome,
  };
  EMOTION.cart = {
    get: getCart,
    lines: cartLines,
    totals: cartTotals,
    add: addToCart,
    setQty,
    remove: removeFromCart,
    clear: clearCart,
    count: cartCount,
  };
  EMOTION.session = { getUser, setUser, USER_KEY, CHECKOUT_KEY };
})();

document.addEventListener("DOMContentLoaded", () => EMOTION.ui.mountChrome());
