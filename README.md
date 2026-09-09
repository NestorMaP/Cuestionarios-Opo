# Cuestionarios-Oposición

Colección de cuestionarios de oposición en HTML, CSS y JavaScript, preparada para publicarse como sitio estático con GitHub Pages.

## Estructura

- `index.html`: índice de cuestionarios disponibles.
- `assets/cuestionarios/general/`: cuestionarios de contenido general.
- `assets/cuestionarios/hemato/`: cuestionarios de hematología.
- `assets/cuestionarios/hemostiasia/`: cuestionarios de hemostasia.
- `assets/plantillas/plantilla-cuestionario.html`: plantilla HTML vacía para crear nuevos cuestionarios.
- `assets/pdfs/`: PDF originales pendientes de convertir.
- `css/styles.css`: estilos compartidos por el índice y todos los cuestionarios.
- `js/quiz.js`: lógica compartida de corrección, reinicio y registro local de fallos.
- `js/access.js`: barrera visual de acceso para evitar accesos casuales.
- `js/index.js`: exportación e importación manual de datos locales.
- `.github/workflows/pages.yml`: despliegue automático en GitHub Pages al subir cambios a `main`.

## Incorporar un cuestionario desde PDF

El proceso es manual y no necesita instalar nada ni configurar una API:

1. Deja el PDF original en `assets/pdfs/`.
2. Pide, en tus propias palabras, que se convierta a cuestionario indicando
   de qué tema se trata (por ejemplo: "convierte este PDF, es de hemostasia").
3. Claude Code se encarga del resto automáticamente: eligiendo carpeta,
   nombre de archivo e identificadores, generando el HTML a partir de
   [plantilla-cuestionario.html](assets/plantillas/plantilla-cuestionario.html),
   añadiendo su tarjeta en `index.html` y subiendo el cambio directamente a
   GitHub (commit y push), para que se publique solo. Solo te preguntará si
   falta un dato que no puede deducir del PDF (por ejemplo, alguna respuesta
   correcta que no aparezca en el documento).

No necesitas saber nombres de archivo, identificadores ni rutas: de eso se
encarga la skill `nuevo-cuestionario` del repositorio
(`.claude/skills/nuevo-cuestionario/SKILL.md`), que sigue siempre las mismas
reglas para que todos los cuestionarios queden consistentes.

La plantilla contiene la estructura HTML y los contratos necesarios para que funcionen automáticamente los estilos, la corrección, el desmarcado de respuestas, la continuación del cuestionario, la persistencia diaria, la penalización y el porcentaje. Los PDF se conservan como fuente original y los HTML son los cuestionarios que se publican.

Si el PDF no contiene las respuestas correctas, indícalo en tu mensaje o adjunta la plantilla oficial de respuestas antes de pedir la conversión; si no, algunas preguntas quedarán marcadas como "sin verificar" hasta que las confirmes.

## Añadir un cuestionario manualmente

Cada cuestionario debe ser un HTML independiente que:

1. Enlace `../../../css/styles.css` y cargue `../../../js/access.js` y `../../../js/quiz.js` desde una carpeta situada dentro de `assets/cuestionarios/<tema>/`.
2. Use un formulario con `id="quiz-form"`.
3. Marque cada pregunta con `.pregunta` y un `data-key` único.
4. Defina `window.quizAnswers` antes de cargar `js/quiz.js`.
5. Incluya los botones `btn-corregir`, `btn-reiniciar` y el elemento `resultado`.

El índice debe incorporar una tarjeta con el título, la convocatoria, la temática y el enlace relativo al nuevo HTML, por ejemplo `assets/cuestionarios/hemato/Cuestionario_hemato.html`.

Las respuestas en curso se guardan únicamente en el navegador mediante `localStorage` y se conservan durante el día actual. El enlace `Volver al índice` permite salir del examen y continuar después sin perder las respuestas de ese día. Al pulsar `Corregir examen` o `Reiniciar cuestionario`, se elimina la selección guardada para que el siguiente acceso empiece sin respuestas preseleccionadas. Los fallos se conservan por separado para futuras funcionalidades y no se envían a ningún servidor. Para llevar los datos a otro dispositivo, exporta `datos-cuestionarios.json` desde el índice e impórtalo en el otro navegador.

En cada tarjeta del índice se puede activar la penalización de errores. Con ella activada, tres respuestas incorrectas restan un acierto. El porcentaje se calcula sobre las preguntas válidas, se muestra con dos decimales y nunca baja de 0 %. La opción se aplica únicamente al acceso siguiente al cuestionario y vuelve a estar desactivada al entrar de nuevo.

## Contraseña y privacidad

La barrera visual usa provisionalmente la clave `oposicion-hemato`, configurable en `js/access.js`. Al estar el repositorio publicado como HTML/CSS/JS, esta contraseña no es una medida de seguridad real: cualquier visitante con conocimientos técnicos puede inspeccionar o descargar el código. Para proteger el contenido de verdad habría que usar un repositorio privado o un sistema con autenticación en servidor.

## Publicar en GitHub Pages

1. Sube el repositorio a GitHub.
2. En `Settings > Pages`, selecciona `Deploy from a branch`.
3. Elige la rama principal y la carpeta `/ (root)`.
4. Accede a la URL que GitHub Pages muestre tras el despliegue.
