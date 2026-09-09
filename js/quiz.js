(function () {
  const form = document.getElementById("quiz-form");
  const result = document.getElementById("resultado");
  const continueButton = document.getElementById("btn-continuar");
  const answers = window.quizAnswers || {};
  const quizId = document.body.dataset.quizId || document.title;
  const storageKey = `quiz-failures:${quizId}`;
  const penaltyKey = `quiz-penalty:${quizId}`;
  const penalizeErrors = sessionStorage.getItem(penaltyKey) === "true";
  sessionStorage.removeItem(penaltyKey);

  function getLocalDate() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  const progressPrefix = `quiz-progress:${quizId}:`;
  const progressKey = `${progressPrefix}${getLocalDate()}`;

  if (!form) return;

  Object.keys(localStorage)
    .filter((key) => key.startsWith(progressPrefix) && key !== progressKey)
    .forEach((key) => localStorage.removeItem(key));

  const savedProgress = JSON.parse(localStorage.getItem(progressKey) || "{}");
  Object.entries(savedProgress).forEach(([key, value]) => {
    const input = form.querySelector(`input[name="${key}"][value="${value}"]`);
    if (input) input.checked = true;
  });
  if (Object.keys(savedProgress).length > 0)
    continueButton?.removeAttribute("hidden");

  function getRadioFromEvent(event) {
    if (!(event.target instanceof Element)) return null;
    if (event.target.matches('input[type="radio"]')) return event.target;
    return event.target.closest("label")?.querySelector('input[type="radio"]');
  }

  function clearSavedAnswer(radio) {
    radio.checked = false;
    const progress = JSON.parse(localStorage.getItem(progressKey) || "{}");
    delete progress[radio.name];
    if (Object.keys(progress).length > 0) {
      localStorage.setItem(progressKey, JSON.stringify(progress));
    } else {
      localStorage.removeItem(progressKey);
      continueButton?.setAttribute("hidden", "");
    }
  }

  let pressedRadio = null;

  form.addEventListener("pointerdown", (event) => {
    const radio = getRadioFromEvent(event);
    pressedRadio = radio ? { radio, wasChecked: radio.checked } : null;
  });

  form.addEventListener("keydown", (event) => {
    const radio = getRadioFromEvent(event);
    if (radio && event.key === " " && radio.checked) {
      pressedRadio = { radio, wasChecked: true };
    }
  });

  form.addEventListener("click", (event) => {
    const radio = getRadioFromEvent(event);
    const wasChecked = pressedRadio?.radio === radio && pressedRadio.wasChecked;
    pressedRadio = null;
    if (radio && wasChecked) {
      event.preventDefault();
      radio.focus();
      clearSavedAnswer(radio);
      window.setTimeout(() => {
        radio.checked = false;
      }, 0);
    }
  });

  form.addEventListener("change", (event) => {
    if (
      !(event.target instanceof HTMLInputElement) ||
      event.target.type !== "radio"
    )
      return;
    const progress = JSON.parse(localStorage.getItem(progressKey) || "{}");
    progress[event.target.name] = event.target.value;
    localStorage.setItem(progressKey, JSON.stringify(progress));
    continueButton?.removeAttribute("hidden");
  });

  function correctQuiz() {
    let correct = 0;
    let incorrect = 0;
    let validQuestions = 0;
    const failures = JSON.parse(localStorage.getItem(storageKey) || "{}");

    form.querySelectorAll(".pregunta").forEach((question) => {
      const key = question.dataset.key;
      const expected = answers[key];
      const selected = question.querySelector("input:checked");
      const title = question.querySelector(".titulo-pregunta");
      question.classList.remove("correcto", "incorrecto", "no-marcada");
      question
        .querySelectorAll(".opciones li")
        .forEach((option) => option.removeAttribute("style"));
      title.querySelector(".marca-anulada")?.remove();

      if (expected === "anulada") {
        question.classList.add("no-marcada");
        title.insertAdjacentHTML(
          "beforeend",
          ' <strong class="marca-anulada">(ANULADA en plantilla oficial)</strong>',
        );
        return;
      }

      if (expected === "sin_verificar") {
        question.classList.add("no-marcada");
        title.insertAdjacentHTML(
          "beforeend",
          ' <strong class="marca-anulada">(RESPUESTA NO VERIFICADA)</strong>',
        );
        return;
      }

      validQuestions++;
      if (!selected) {
        question.classList.add("no-marcada");
        return;
      }

      if (selected.value === expected) {
        correct++;
        question.classList.add("correcto");
        delete failures[key];
      } else {
        incorrect++;
        question.classList.add("incorrecto");
        failures[key] = true;
        const correctOption = question.querySelector(
          `input[value="${expected}"]`,
        );
        correctOption
          ?.closest("li")
          .setAttribute(
            "style",
            "background-color: #c3e6cb; font-weight: bold;",
          );
      }
    });

    localStorage.setItem(storageKey, JSON.stringify(failures));
    localStorage.removeItem(progressKey);
    continueButton?.setAttribute("hidden", "");
    const score = Math.max(0, correct - (penalizeErrors ? incorrect / 3 : 0));
    const percentage = validQuestions > 0 ? (score / validQuestions) * 100 : 0;
    result.textContent = `Aciertos: ${correct} de ${validQuestions} | Porcentaje: ${percentage.toFixed(2)}%`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetQuiz() {
    form.reset();
    localStorage.removeItem(progressKey);
    continueButton?.setAttribute("hidden", "");
    form.querySelectorAll(".pregunta").forEach((question) => {
      question.classList.remove("correcto", "incorrecto", "no-marcada");
      question
        .querySelectorAll(".opciones li")
        .forEach((option) => option.removeAttribute("style"));
      question.querySelector(".marca-anulada")?.remove();
    });
    result.textContent = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document
    .getElementById("btn-corregir")
    ?.addEventListener("click", correctQuiz);
  document
    .getElementById("btn-reiniciar")
    ?.addEventListener("click", resetQuiz);
  continueButton?.addEventListener("click", () => {
    const pendingQuestion = [...form.querySelectorAll(".pregunta")].find(
      (question) => !question.querySelector("input:checked"),
    );
    (pendingQuestion || form.querySelector(".pregunta"))?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
})();
