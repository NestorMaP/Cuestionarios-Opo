(function () {
  const exportButton = document.getElementById("exportar-datos");
  const importInput = document.getElementById("importar-datos");
  const storagePrefix = "quiz-";
  const penaltyStoragePrefix = "quiz-penalty:";

  function getLocalDate() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  function hasProgress(quizId) {
    const key = `quiz-progress:${quizId}:${getLocalDate()}`;
    try {
      const progress = JSON.parse(localStorage.getItem(key) || "{}");
      return Object.keys(progress).length > 0;
    } catch {
      return false;
    }
  }

  function updateQuizLinks() {
    document.querySelectorAll(".cuestionario[data-quiz-id]").forEach((card) => {
      const link = card.querySelector(".quiz-link");
      if (!link) return;
      const continuing = hasProgress(card.dataset.quizId);
      link.textContent = continuing
        ? "Continuar cuestionario"
        : "Comenzar cuestionario";
      link.classList.toggle("boton-continuar", continuing);
      link.classList.toggle("boton-principal", !continuing);
    });
  }

  document.querySelectorAll(".cuestionario[data-quiz-id]").forEach((card) => {
    const quizId = card.dataset.quizId;
    const penaltyToggle = card.querySelector("[data-penalty-toggle]");
    const link = card.querySelector(".quiz-link");
    if (!penaltyToggle || !link) return;

    penaltyToggle.checked = false;
    link.addEventListener("click", () => {
      const key = `${penaltyStoragePrefix}${quizId}`;
      if (penaltyToggle.checked) {
        sessionStorage.setItem(key, "true");
      } else {
        sessionStorage.removeItem(key);
      }
    });
  });

  updateQuizLinks();

  const ajustesMenu = document.querySelector(".ajustes-menu");
  const ajustesToggle = document.getElementById("ajustes-toggle");
  const ajustesLista = document.getElementById("ajustes-lista");
  const failuresPrefix = "quiz-failures:";

  function cerrarAjustes() {
    ajustesLista?.setAttribute("hidden", "");
    ajustesToggle?.setAttribute("aria-expanded", "false");
  }

  ajustesToggle?.addEventListener("click", () => {
    const abierto = !ajustesLista?.hasAttribute("hidden");
    if (abierto) {
      cerrarAjustes();
    } else {
      ajustesLista?.removeAttribute("hidden");
      ajustesToggle.setAttribute("aria-expanded", "true");
    }
  });

  document.getElementById("borrar-fallos")?.addEventListener("click", () => {
    const confirmado = window.confirm(
      "¿Eliminar el registro de todas las preguntas falladas de todos los cuestionarios? Esta acción no se puede deshacer.",
    );
    cerrarAjustes();
    if (!confirmado) return;
    Object.keys(localStorage)
      .filter((key) => key.startsWith(failuresPrefix))
      .forEach((key) => localStorage.removeItem(key));
    window.alert("Registro de respuestas falladas eliminado.");
  });

  document.getElementById("restablecer-todo")?.addEventListener("click", () => {
    const confirmado = window.confirm(
      "¿Restablecer todos los datos guardados (progreso y registro de fallos) de todos los cuestionarios? Esta acción no se puede deshacer.",
    );
    cerrarAjustes();
    if (!confirmado) return;
    Object.keys(localStorage)
      .filter((key) => key.startsWith(storagePrefix))
      .forEach((key) => localStorage.removeItem(key));
    updateQuizLinks();
    window.alert("Todos los datos se han restablecido.");
  });

  document.addEventListener("click", (event) => {
    if (
      !ajustesLista?.hasAttribute("hidden") &&
      ajustesMenu &&
      !ajustesMenu.contains(event.target)
    ) {
      cerrarAjustes();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      cerrarAjustes();
    }
  });

  function getStoredData() {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(storagePrefix))
      .reduce(
        (data, key) => ({ ...data, [key]: localStorage.getItem(key) }),
        {},
      );
  }

  exportButton?.addEventListener("click", () => {
    const file = new Blob([JSON.stringify(getStoredData(), null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "datos-cuestionarios.json";
    link.click();
    URL.revokeObjectURL(link.href);
  });

  importInput?.addEventListener("change", async () => {
    const [file] = importInput.files;
    if (!file) return;

    try {
      const data = JSON.parse(await file.text());
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith(storagePrefix) && typeof value === "string") {
          localStorage.setItem(key, value);
        }
      });
      window.alert("Datos importados correctamente.");
      updateQuizLinks();
    } catch {
      window.alert("No se ha podido importar el archivo.");
    }
    importInput.value = "";
  });
})();
