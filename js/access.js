(function () {
  const accessPassword = "nero";
  const accessKey = "questionnaires-access-granted";

  function showAccessGate() {
    if (sessionStorage.getItem(accessKey) === "true") return;

    const overlay = document.createElement("div");
    overlay.className = "access-overlay";
    overlay.innerHTML = `
      <form class="access-panel">
        <div class="access-encabezado">
          <div class="access-icono" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="10" width="16" height="10" rx="2"></rect>
              <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
            </svg>
          </div>
          <p class="indice-kicker">Acceso de estudio</p>
          <h1>Cuestionarios de oposición</h1>
          <p>Introduce la clave para continuar.</p>
        </div>
        <label for="access-password">Contraseña</label>
        <input id="access-password" type="password" autocomplete="current-password" required>
        <p class="access-error" role="alert" hidden>La contraseña no es correcta.</p>
        <button class="boton boton-principal" type="submit">Entrar</button>
      </form>`;

    document.body.prepend(overlay);
    overlay.querySelector("input").focus();
    overlay.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      const input = overlay.querySelector("input");
      if (input.value.toLowerCase() !== accessPassword.toLowerCase()) {
        overlay.querySelector(".access-error").hidden = false;
        input.select();
        return;
      }
      sessionStorage.setItem(accessKey, "true");
      overlay.remove();
    });
  }

  document.addEventListener("DOMContentLoaded", showAccessGate);
})();
