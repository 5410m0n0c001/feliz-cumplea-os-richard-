# 💌 Manual de Replicación - Plantilla de Invitación Digital

Este proyecto es una invitación digital premium diseñada para ser utilizada como **plantilla base** para futuros eventos. Cuenta con una apertura de sobre animada, música de fondo sincronizada, mensajes personalizados y una lógica de carga inteligente de recursos (assets).

---

## 🚀 Guía de Replicación

Para crear un nuevo proyecto basado en este repositorio, sigue estos pasos:

1. **Clonar el Repositorio**: Copia todos los archivos (`index.html`, `index.css`, `index.js`) y la carpeta de assets a tu nuevo directorio.
2. **Personalizar Textos**:
   - En `index.html`, cambia el `<title>` y los meta tags de SEO.
   - En el bloque `id="greeting-card"`, actualiza los nombres y el mensaje de felicitación.
3. **Reemplazar Assets**: Simplemente sustituye los archivos multimedia en la carpeta raíz (ver tabla de assets abajo).
4. **Eliminar la Visita Guiada**: Sigue las instrucciones en la sección [Eliminar Visita Guiada](#-eliminar-visita-guiada).

---

## 📂 Gestión de Assets (Recursos)

El proyecto utiliza un sistema de **Carga Inteligente**. Si cambias el formato de un archivo (por ejemplo, de `.jpg` a `.webp`), el código lo detectará automáticamente siempre que mantenga el nombre base.

| Asset | Nombre Base Recomendado | Propósito | Formatos Soportados |
| :--- | :--- | :--- | :--- |
| **Sobre Cerrado** | `sobrec` | Imagen del sobre antes de abrir. | `.png`, `.webp`, `.jpg` |
| **Video Apertura** | `sobrev` | Video de la animación del sobre abriéndose. | `.mp4`, `.webm`, `.mov` |
| **Video Principal** | `video` | Mensaje de video personalizado. | `.mp4`, `.webm`, `.mov` |
| **Música** | `mañanitas` | Canción o melodía de fondo. | `.mp3`, `.wav`, `.ogg` |
| **Imagen Destacada** | `destacada` | Miniatura para compartir en redes sociales. | `.jpg`, `.webp`, `.png` |

> [!TIP]
> Si el sistema no encuentra el archivo exacto configurado en el HTML, buscará automáticamente archivos con el mismo nombre pero diferente extensión según la prioridad definida en `index.js`.

---

## 🛠 Eliminar Visita Guiada

Este proyecto incluye una visita guiada educativa que **no debe replicarse** en proyectos finales para clientes. Para eliminarla, borra los siguientes bloques de código:

### 1. En `index.html`:
- Elimina el botón con `id="tour-btn"` (Líneas 74-81 aprox).
- Elimina el bloque completo de `id="tour-overlay"` (Líneas 92-115 aprox).

### 2. En `index.css`:
- Borra toda la sección bajo el comentario `/* Tour Overlay & Spotlight */` (Líneas 164-286 aprox).

### 3. En `index.js`:
- Borra las variables de "Tour Elements".
- Borra el array `tourSteps`.
- Borra las funciones `updateSpotlight`, `positionCard`, `showStep` y `closeTour`.
- Borra los Event Listeners relacionados con `tourNext`, `tourPrev`, etc.

---

## 🛠 Detalles Técnicos
- **CSS**: Vanilla CSS con variables para fácil cambio de colores (`--gold`, `--bg-dark`).
- **JS**: Vanilla JavaScript sin dependencias externas.
- **Responsividad**: Optimizado para dispositivos móviles y escritorio.

---
*Desarrollado para Primavera Events Group.*
