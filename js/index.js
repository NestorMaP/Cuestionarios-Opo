(function () {
  const exportButton = document.getElementById("exportar-datos");
  const importInput = document.getElementById("importar-datos");
  const storagePrefix = "quiz-";

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

  updateQuizLinks();

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
