document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("account-root");

  function view() {
    const user = EMOTION.session.getUser();
    if (user) {
      root.innerHTML = `
        <h1>Hola, ${user.name}</h1>
        <p class="note">${user.email}</p>
        <p>Sesión de prototipo. La autenticación real irá a POST /api/auth.</p>
        <button class="btn btn-ghost" id="out">Cerrar sesión</button>
      `;
      document.getElementById("out").onclick = () => {
        EMOTION.session.setUser(null);
        view();
      };
      return;
    }
    root.innerHTML = `
      <h1>Cuenta</h1>
      <p class="note">No guardamos contraseñas en este prototipo.</p>
      <form id="login">
        <label>Nombre<br><input name="name" required style="width:100%;height:44px;margin:8px 0;border-radius:10px;border:1px solid var(--line);padding:0 12px"></label>
        <label>Correo<br><input type="email" name="email" required style="width:100%;height:44px;margin:8px 0;border-radius:10px;border:1px solid var(--line);padding:0 12px"></label>
        <button class="btn btn-primary" type="submit" style="width:100%;margin-top:8px">Entrar</button>
      </form>
    `;
    document.getElementById("login").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      EMOTION.session.setUser({ name: fd.get("name"), email: fd.get("email") });
      EMOTION.ui.toast("Sesión iniciada (local)");
      view();
    };
  }
  view();
});
