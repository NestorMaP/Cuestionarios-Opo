---
name: nuevo-cuestionario
description: Convierte un PDF de examen en un cuestionario HTML para este repositorio de oposición y lo añade al índice. Úsala cuando el usuario haya dejado (o vaya a dejar) un PDF en assets/pdfs/ y pida crear, convertir o añadir un cuestionario nuevo a partir de él, aunque lo pida en lenguaje informal ("convierte este pdf", "añade el examen de X", "métemelo en el cuestionario").
---

# Nuevo cuestionario a partir de un PDF

El usuario de este repositorio no sabe de informática. El objetivo de esta skill
es que baste con decir de qué PDF y de qué tema se trata: tú decides el resto
(carpeta, nombre de archivo, identificadores, tarjeta del índice) sin pedirle
datos técnicos. Solo debes preguntarle cosas que él sí puede responder:
de qué examen se trata o cuáles son las respuestas correctas cuando falten.

## 1. Localiza el PDF de entrada

- Si el usuario ha indicado un nombre de archivo, úsalo.
- Si no, mira en `assets/pdfs/`. Si hay un único PDF que aún no tiene un
  cuestionario HTML correspondiente, úsalo sin preguntar.
- Si hay varios PDF candidatos y no está claro cuál, pregunta cuál de ellos
  (dale la lista de nombres, no le pidas rutas ni identificadores).
- Si el usuario menciona un PDF que todavía no está en `assets/pdfs/`, pídele
  que lo suba primero (arrastrándolo a esa carpeta) y espera confirmación.

## 2. Decide el tema/carpeta sin preguntas técnicas

- Lee `index.html` y `assets/cuestionarios/` para ver los temas ya existentes
  (por ejemplo `general`, `hemato`, `hemostiasia`).
- Si el usuario menciona un tema que ya existe (aunque lo escriba distinto,
  p. ej. "hemato" y "hematología"), reutiliza esa carpeta.
- Si es un tema nuevo, crea una carpeta nueva dentro de `assets/cuestionarios/`
  con un slug corto en minúsculas, sin espacios ni acentos (p. ej.
  "Bioquímica clínica" -> `bioquimica`).
- Nunca le preguntes al usuario el nombre exacto de la carpeta o del archivo;
  decídelo tú a partir del tema y del contenido del PDF.

## 3. Lee el PDF completo

- Extrae todas las preguntas, opciones y (si están) las respuestas correctas.
- Identifica también, si aparecen en el propio PDF, el título del examen, la
  convocatoria (comunidad autónoma u organismo) y el año. Si no aparecen,
  infiere un título razonable a partir del nombre del PDF y pregúntale al
  usuario solo el dato que falte y no puedas deducir (normalmente la
  convocatoria/año), en una sola pregunta corta.

## 4. Genera identificadores únicos tú mismo

- Antes de generarlos, busca los `data-quiz-id` ya usados en `index.html` y
  los `data-key` ya usados en los HTML de `assets/cuestionarios/` para no
  repetir ninguno.
- `data-quiz-id` del cuestionario: slug corto basado en el tema y la
  convocatoria (p. ej. `hemostiasia-larioja-2019`). Si ya existe un
  cuestionario para ese mismo tema, numera o distingue por convocatoria.
- Nombre del archivo HTML: mismo slug, terminado en `.html`.
- `data-key` de cada pregunta: `<convocatoria>_<año>_<numero>` en minúsculas
  y sin espacios (sigue el patrón que ya usan los cuestionarios existentes,
  p. ej. `la_rioja_2019_28`).

## 5. Genera el HTML siguiendo la plantilla

Usa `assets/plantillas/plantilla-cuestionario.html` como base. Reglas:

1. Convierte todas las preguntas del PDF, manteniendo idioma, texto,
   numeración y orden.
2. Usa los estilos y scripts compartidos: no copies CSS ni lógica de
   corrección dentro del HTML.
3. Mantén los elementos `id="quiz-form"`, `id="resultado"`,
   `id="btn-continuar"`, `id="btn-corregir"` e `id="btn-reiniciar"`.
4. Cada pregunta va en un bloque `.pregunta` con `data-key` único, y las
   opciones usan `name="[data-key]"` con `value="a"`, `"b"`, `"c"`, `"d"`.
5. Define `window.quizAnswers` con la respuesta correcta de cada pregunta:
   - Si el PDF trae la plantilla de respuestas, úsala tal cual. No inventes
     respuestas correctas.
   - Si para una pregunta concreta no puedes verificar la respuesta, usa
     `"sin_verificar"` como valor (el propio cuestionario ya marca esas
     preguntas visualmente) en lugar de detener toda la conversión.
   - Si una pregunta está anulada en la plantilla oficial, conserva sus
     opciones, añade `[ANULADA]` al título y usa `"anulada"` como respuesta.
   - Si la propia plantilla de respuestas marca una pregunta como dudosa,
     impugnada o impugnable, o si tú detectas que la respuesta oficial es
     discutible (p. ej. contradice el conocimiento estándar de la materia),
     usa igualmente la respuesta oficial en `window.quizAnswers` pero añade
     justo debajo de las opciones un aviso breve con
     `<div class="nota-pregunta">Nota: ...</div>` resumiendo la duda en una
     frase. No lo uses para dudas tuyas sin fundamento, solo cuando la fuente
     lo señale o la inconsistencia sea clara.
6. Conserva los casos clínicos con el bloque `intro-caso` cuando el PDF
   agrupe preguntas bajo un enunciado común.
7. Las rutas relativas deben ser `../../../css/styles.css`,
   `../../../js/access.js`, `../../../js/quiz.js` y `../../../index.html`
   (el cuestionario vive en `assets/cuestionarios/<tema>/`, tres niveles por
   debajo de la raíz).
8. Guarda el resultado en
   `assets/cuestionarios/<tema>/<archivo>.html`.

## 6. Añade la tarjeta en `index.html`

Añade dentro de `<section class="cuestionarios">`, al final, una tarjeta con
esta estructura (sustituyendo los valores):

```html
<article class="cuestionario" data-quiz-id="[identificador-unico]">
  <div class="cuestionario-detalles">
    <div>
      <h2>[Título]</h2>
      <p><strong>Convocatoria:</strong> [Comunidad u organismo], [Año]</p>
      <p><strong>Temática:</strong> [Temática]</p>
    </div>
    <label class="penalizacion-control">
      <input type="checkbox" data-penalty-toggle />
      <span>Penalizar errores</span>
      <small>3 fallos quitan 1 acierto</small>
    </label>
  </div>
  <a
    class="boton boton-principal quiz-link"
    href="assets/cuestionarios/[tema]/[archivo].html"
    >Comenzar cuestionario</a
  >
</article>
```

## 7. Verificación final

- Revisa que no queden preguntas, opciones o respuestas sin convertir.
- Comprueba que no hay `data-quiz-id` ni `data-key` duplicados en todo el
  repositorio.
- Confirma que las rutas relativas del nuevo HTML son correctas.

## 8. Publica el cambio tú mismo: commit y push automáticos

Quien usa este repositorio no sabe usar git, así que esta skill es la única
autorizada a hacer commit y push sin pedir confirmación en cada paso. Al
terminar una conversión, completa siempre esto (sin preguntar si quiere que
lo hagas):

1. `git add` de todos los archivos que hayas creado o modificado en esta
   conversión: el HTML nuevo del cuestionario, `index.html`, y cualquier
   otro archivo tocado (por ejemplo `css/styles.css` si añadiste una nota).
   Incluye también el PDF de `assets/pdfs/` si no estaba ya versionado.
2. Crea un commit con un mensaje breve en español describiendo el
   cuestionario añadido (p. ej. "Añadir cuestionario de Banco de Sangre"),
   siguiendo el estilo de los commits ya existentes en el repositorio
   (`git log` para verlo) y con cualquier línea de atribución que tus
   propias instrucciones de sistema indiquen para commits de Claude Code.
3. Haz `git push` a la rama actual (normalmente `main`) para que
   GitHub Pages publique el cuestionario nuevo automáticamente.
4. Si el push falla porque la rama remota tiene cambios que no tienes en
   local, haz `git pull` primero (nunca `--force`) y reinténtalo. Si surge
   un conflicto que no puedas resolver de forma segura, detente y explícale
   al usuario en lenguaje sencillo qué ha pasado, sin forzar nada.

## 9. Informa al usuario en lenguaje sencillo

Al terminar, dile en 2-3 frases sin tecnicismos:
- Qué cuestionario has creado y que ya está publicado (subido) en el sitio.
- Qué preguntas (si alguna) han quedado marcadas como "sin verificar" porque
  no pudiste confirmar la respuesta correcta en el PDF, pidiéndole solo esas
  respuestas concretas si las necesita.
- Que el PDF original se conserva en `assets/pdfs/` como fuente.

No le pidas que revise nombres de archivo, identificadores, rutas, ni que
haga commit o push: todo eso es responsabilidad tuya, no suya.
