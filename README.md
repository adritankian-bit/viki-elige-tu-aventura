# Elige tu aventura, Viki

Invitación de cumpleaños estática con tres aventuras, elección local y opción de compartir. Las ilustraciones vectoriales de `site/art/` son originales y representan los tres universos de forma artística. La fecha de Terra Mítica queda pendiente de la próxima temporada de apertura.

## Abrir y editar

Abre `site/index.html` para ver la invitación. Los textos de cada aventura están al principio de `site/app.js`. El resto de la felicitación está en `site/index.html` y `site/app.js`.

Ejecuta `node build.mjs` desde la carpeta del proyecto para validar las referencias y preparar `dist/`. Para probar el menú nativo de compartir, abre el sitio publicado por HTTPS en un teléfono compatible. También hay un enlace de WhatsApp y una alternativa para copiar el mensaje.

## Publicar

1. Crea un repositorio público vacío llamado `viki-elige-tu-aventura` en GitHub.
2. Sube el contenido de esta carpeta a `main` con Git, incluida la carpeta oculta `.github`.
3. En **Settings → Pages → Build and deployment → Source**, elige **GitHub Actions**.
4. En **Actions → Publicar en GitHub Pages → Run workflow**, ejecuta el flujo en `main`.
5. Abre la URL que aparece en **Settings → Pages** desde el móvil y comparte ese enlace por WhatsApp.

La compilación usa rutas relativas y no requiere dependencias npm, credenciales de terceros ni ajustes de URL.
