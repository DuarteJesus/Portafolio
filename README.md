# Portafolio de Duarte

Sitio personal de Duarte publicado en https://duartedev.lat/ con GitHub Pages. Incluye el portafolio en la raíz y el perfil de staff de SuperCraft en https://duartedev.lat/staff/.

## Archivos

- `index.html`: contenido y script de navegación.
- `style.css`: estilos.
- `site-preferences.js` y `site-preferences.css`: selector persistente de idioma (español/inglés) y tema (oscuro/claro), compartido por las páginas públicas y la dashboard.
- `dashboard/`: dashboard privada para ver métricas anónimas y administrar mensajes.
- `site-backend.js` y `supabase-config.js`: integración del formulario y las métricas con Supabase.
- `supabase/schema.sql`: tablas, funciones y políticas de acceso del backend.
- `CNAME`: dominio personalizado (`duartedev.lat`). No lo borres.
- `sitemap.xml` y `robots.txt`: para buscadores de las dos secciones.
- `privacidad.html`: aviso de privacidad.
- `404.html`: página que se muestra cuando una dirección no existe.
- `og-image.png`: imagen que aparece al compartir el enlace.
- `img/` y `Proyectos/`: tu foto y los .zip de los proyectos (súbelas tú).
- `staff/`: perfil de SuperCraft, con sus propios `index.html`, `style.css`, `privacidad.html` y `og-image.png`.

## Idioma, tema y buscadores

El sitio ofrece español e inglés, y modo oscuro o claro. La primera visita toma las preferencias del navegador; cualquier cambio se guarda para las próximas visitas. La página privada de la dashboard se excluye del rastreo y no aparece en el sitemap.

Las preferencias de idioma y tema se conservan en el almacenamiento local del navegador y no se envían al servidor.

El portafolio incluye metadatos y datos estructurados de la persona, además del sitemap y el archivo de verificación de Google Search Console. Publica los cambios y envía `https://duartedev.lat/sitemap.xml` desde Search Console para solicitar el rastreo. El posicionamiento depende de los motores de búsqueda y no se puede garantizar una posición ni una fecha de aparición; la información del perfil debe seguir siendo exacta y pública.
