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
2. Indica qué tema debe tener: `general`, `hemato` u otra carpeta nueva dentro de `assets/cuestionarios/`.
3. Pídeme que convierta el PDF a HTML siguiendo [plantilla-cuestionario.html](assets/plantillas/plantilla-cuestionario.html).
4. El HTML generado se guardará en `assets/cuestionarios/<tema>/`.
5. Añade su tarjeta y enlace en `index.html`.

La plantilla contiene la estructura HTML y los contratos necesarios para que funcionen automáticamente los estilos, la corrección, el desmarcado de respuestas, la continuación del cuestionario, la persistencia diaria, la penalización y el porcentaje. Los PDF se conservan como fuente original y los HTML son los cuestionarios que se publican.

### Prompt para convertir un PDF

Después de dejar el PDF en `assets/pdfs/`, puedes usar este prompt y sustituir los campos entre corchetes:

```text
Quiero convertir el PDF [NOMBRE_DEL_PDF] en un cuestionario HTML para este repositorio.

Datos del cuestionario:
- Tema/carpeta de destino: [general | hemato | OTRO_TEMA]
- Nombre del archivo HTML: [NOMBRE_DEL_HTML]
- Título provisional: [TÍTULO]
- Convocatoria: [COMUNIDAD U ORGANISMO] - [AÑO]
- Temática: [TEMÁTICA]

Archivo de entrada:
- assets/pdfs/[NOMBRE_DEL_PDF]

Archivo de plantilla que debes seguir:
- assets/plantillas/plantilla-cuestionario.html

Instrucciones:
1. Lee el PDF completo y convierte todas sus preguntas al formato HTML de la plantilla.
2. Guarda el resultado en assets/cuestionarios/[OTRO_TEMA]/[NOMBRE_DEL_HTML].html.
3. Usa los estilos y scripts compartidos del repositorio. No copies CSS ni la lógica de corrección dentro del HTML.
4. Mantén el idioma, el texto, la numeración y el orden de las preguntas del PDF.
5. Sustituye [identificador-unico] por un identificador estable, corto y sin espacios. Debe ser único para ese cuestionario.
6. Crea un data-key único para cada pregunta y usa el mismo valor en el atributo name de sus opciones.
7. Define window.quizAnswers con la respuesta correcta de cada pregunta.
8. No inventes respuestas correctas. Si el PDF no incluye la plantilla de respuestas o existe alguna duda, detente y pregúntame antes de completar esa parte.
9. Si una pregunta está anulada, conserva sus opciones, marca [ANULADA] en el título y usa "anulada" como respuesta.
10. Conserva los casos clínicos y su contexto mediante bloques intro-caso cuando corresponda.
11. Mantén los elementos id="quiz-form", id="resultado", id="btn-continuar", id="btn-corregir" e id="btn-reiniciar" de la plantilla.
12. Añade en index.html una tarjeta con esta estructura, sustituyendo los valores entre corchetes:

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
			<a class="boton boton-principal quiz-link"
				 href="assets/cuestionarios/[OTRO_TEMA]/[NOMBRE_DEL_HTML].html">
				Comenzar cuestionario
			</a>
		</article>

13. Comprueba que las rutas relativas a ../../../css/styles.css, ../../../js/access.js y ../../../js/quiz.js son correctas desde la carpeta del cuestionario.
14. No implementes lógica nueva dentro del HTML: quiz.js ya gestiona respuestas guardadas, desmarcado, continuación, penalización y porcentaje con dos decimales.
15. Revisa que no queden preguntas, opciones o respuestas sin convertir y valida los archivos modificados.

Antes de terminar, dime qué preguntas o respuestas no has podido verificar en el PDF.
```

Si el PDF no contiene las respuestas correctas, debes proporcionar también la plantilla oficial de respuestas o indicarlas en un mensaje aparte antes de pedir la conversión.

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
