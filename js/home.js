document.addEventListener("DOMContentLoaded", () => {
  const cats = document.getElementById("cats");
  cats.innerHTML = EMOTION.categories
    .map(
      (c) => `
      <a class="cat-card" href="${EMOTION.ui.catalogUrl({ cat: c.id })}">
        <img src="${c.image}" alt="${c.name}">
        <div>
          <h3>${c.name}</h3>
          <p>${c.copy}</p>
        </div>
      </a>`
    )
    .join("");

  document.getElementById("featured").innerHTML = EMOTION.products
    .filter((p) => p.featured)
    .slice(0, 6)
    .map(EMOTION.ui.productCard)
    .join("");

  const offer = EMOTION.products.find((p) => p.offer && p.category === "patinetas");
  document.getElementById("offers").innerHTML = offer ? EMOTION.ui.productCard(offer) : "";

  document.getElementById("quotes").innerHTML = EMOTION.testimonials
    .map(
      (t) => `
      <blockquote class="quote">
        <p class="stars">${EMOTION.ui.stars(t.rating)}</p>
        <p>“${t.text}”</p>
        <p><strong>${t.name}</strong> · ${t.city}</p>
      </blockquote>`
    )
    .join("");

  document.getElementById("faqs").innerHTML = EMOTION.faqs
    .map(
      (f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`
    )
    .join("");
});
