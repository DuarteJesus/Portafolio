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

## Cómo publicarla

Settings → Pages → Deploy from a branch → `main` → carpeta `/ (root)`. El dominio `duartedev.lat` se configura con el `CNAME` de la raíz. El perfil de staff se publica en `https://duartedev.lat/staff/`.

## Configurar mensajes y dashboard

La web es estática. Para guardar mensajes y mostrar métricas se necesita un proyecto de Supabase:

1. Crea un proyecto en Supabase y abre **SQL Editor**.
2. Ejecuta el contenido de `supabase/schema.sql`. El script autoriza la dashboard solo para `duartedigital@icloud.com`.
3. En **Authentication → Users**, crea el usuario `duartedigital@icloud.com`. La dashboard usa un enlace de acceso por correo, no una contraseña del sitio.
4. En **Authentication → URL Configuration**, establece `https://duartedev.lat` como Site URL y añade `https://duartedev.lat/dashboard/` a Redirect URLs. Habilita el acceso por enlace de correo.
5. Copia la **Project URL** y la clave pública **anon/publishable** de la configuración de API a `supabase-config.js`. No pongas la clave `service_role` en la web.
6. Publica los cambios en `main`. La dashboard estará en `https://duartedev.lat/dashboard/`.

La base de datos no expone mensajes ni estadísticas al público: las escrituras públicas pasan por funciones limitadas y las lecturas/gestión requieren autenticación y autorización por fila. Las métricas agregadas no incluyen IP, nombre ni user agent; las sesiones aleatorias inactivas se eliminan al volver a recibir visitas tras 30 días.

## Idioma, tema y buscadores

El sitio ofrece español e inglés, y modo oscuro o claro. La primera visita toma las preferencias del navegador; cualquier cambio se guarda para las próximas visitas. La página privada de la dashboard se excluye del rastreo y no aparece en el sitemap.

Las preferencias de idioma y tema se conservan en el almacenamiento local del navegador y no se envían al servidor.

El portafolio incluye metadatos y datos estructurados de la persona, además del sitemap y el archivo de verificación de Google Search Console. Publica los cambios y envía `https://duartedev.lat/sitemap.xml` desde Search Console para solicitar el rastreo. El posicionamiento depende de los motores de búsqueda y no se puede garantizar una posición ni una fecha de aparición; la información del perfil debe seguir siendo exacta y pública.
