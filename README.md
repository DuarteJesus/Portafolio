# Portafolio de Duarte

Sitio personal de Duarte publicado en https://duartedev.lat/ con GitHub Pages. Incluye el portafolio en la raíz y el perfil de staff de SuperCraft en https://duartedev.lat/staff/.

## Archivos

- `index.html`: contenido y script de navegación.
- `style.css`: estilos.
- `site-preferences.js` y `site-preferences.css`: selector persistente de idioma (español/inglés) y tema (oscuro/claro), compartido por las páginas públicas y la dashboard.
- `dashboard/`: dashboard privada para ver métricas anónimas y administrar mensajes.
- `site-backend.js` y `supabase-config.js`: integración del formulario y las métricas con Supabase.
- `supabase/schema.sql`: tablas, funciones y políticas de acceso del backend.
- `supabase/functions/`: bot HTTP de Discord, notificaciones privadas, respuestas a preguntas y sistema de tickets.
- `scripts/register-discord-commands.ps1`: registro de los comandos de la aplicación en tu servidor.
- `CNAME`: dominio personalizado (`duartedev.lat`). No lo borres.
- `sitemap.xml` y `robots.txt`: para buscadores de las dos secciones.
- `privacidad.html`: aviso de privacidad.
- `404.html`: página que se muestra cuando una dirección no existe.
- `og-image.png`: imagen que aparece al compartir el enlace.
- `img/` y `Proyectos/`: tu foto y los .zip de los proyectos (súbelas tú).
- `staff/`: perfil de SuperCraft, con sus propios `index.html`, `style.css`, `privacidad.html` y `og-image.png`.

## Bot de Discord y tickets

El bot usa **Supabase Edge Functions** para recibir interacciones HTTP de Discord. No necesita un proceso Gateway encendido todo el día ni un servicio de hosting adicional; se mantiene dentro de los límites gratuitos de Supabase, sujetos a sus cuotas y políticas. Las funciones son independientes de la web estática y sirven para cualquier página del sitio que invoque una integración.

### 1. Crear e instalar la aplicación

1. Crea una aplicación en el [Discord Developer Portal](https://discord.com/developers/applications) y añade un bot.
2. En **General Information**, copia el *Public Key*. En **Bot**, genera/copia el token. En **OAuth2 → General**, copia el *Application ID* y el *Client Secret*. No publiques esos secretos ni los añadas a Git.
3. En **OAuth2 → General**, añade esta URL de redirección exacta:

   `https://zfnwwggnvurzmwypjijb.supabase.co/functions/v1/discord-oauth`

   La web solicita los scopes `identify` y `guilds.members.read` para verificar la identidad y pertenencia al servidor. No solicita el correo ni permiso para unirte automáticamente al servidor.
4. Activa la instalación en servidor (**Guild Install**) con los scopes `bot` y `applications.commands`. Concede únicamente `Manage Channels`, `View Channels` y `Send Messages`; `Manage Channels` se necesita para crear y cerrar canales privados de tickets.
5. Instala la aplicación en tu servidor, donde debes tener permiso para gestionar el servidor. En la configuración del servidor, activa **Developer Mode** y copia el ID del servidor, el ID del rol de staff que podrá ver/cerrar tickets y, opcionalmente, el ID de una categoría para tickets.
### 2. Desplegar las funciones

En Windows, instala Scoop desde su [guía oficial](https://scoop.sh/) si aún no lo tienes. Luego abre PowerShell en la carpeta del repositorio y ejecuta:

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
supabase login
supabase link --project-ref zfnwwggnvurzmwypjijb
supabase functions deploy discord-interactions
supabase functions deploy discord-notify
supabase functions deploy discord-oauth
```

En **Supabase → Edge Functions → Secrets**, configura estos secretos para el proyecto (no los pongas en `supabase-config.js` ni en Git):

- `DISCORD_PUBLIC_KEY`: Public Key de la aplicación.
- `DISCORD_BOT_TOKEN`: token del bot.
- `DISCORD_APPLICATION_ID`: Application ID.
- `DISCORD_CLIENT_SECRET`: Client Secret de Discord OAuth.
- `DISCORD_OAUTH_REDIRECT_URI`: `https://zfnwwggnvurzmwypjijb.supabase.co/functions/v1/discord-oauth` (debe coincidir exactamente con el redirect de Discord).
- `DISCORD_OAUTH_STATE_SECRET`: secreto aleatorio para firmar el estado anti-CSRF de OAuth; genera uno igual que el secreto del webhook.
- `DISCORD_GUILD_ID`: ID del servidor.
- `DISCORD_STAFF_ROLE_ID`: ID del rol autorizado para ver/cerrar tickets.
- `DISCORD_TICKET_CATEGORY_ID`: opcional, ID de la categoría donde crear tickets.
- `DISCORD_NOTIFICATION_CHANNEL_ID`: ID del canal privado que recibirá los mensajes de la web.
- `DISCORD_WEBHOOK_SECRET`: secreto aleatorio compartido con el webhook de base de datos. Puedes generar uno en PowerShell con `([guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N'))`; guarda el resultado de forma privada.

Las funciones desactivan la validación JWT de Supabase porque Discord no envía JWT de Supabase. `discord-interactions` verifica las firmas Ed25519 de Discord; `discord-notify` exige el secreto compartido en el encabezado `x-webhook-secret`; `discord-oauth` firma y verifica el estado anti-CSRF. La función OAuth revoca el token de acceso después de comprobar la identidad y pertenencia al servidor, sin guardarlo.

Después de desplegar `discord-interactions`, configura en el Discord Developer Portal la URL de interacciones `https://zfnwwggnvurzmwypjijb.supabase.co/functions/v1/discord-interactions`. Discord enviará un ping de verificación; la función responde al ping y valida las firmas Ed25519.

### 3. Registrar comandos

En PowerShell, define temporalmente los IDs y escribe el token de forma oculta. El bloque lo elimina del entorno al terminar:

```powershell
$secureToken = Read-Host 'Token del bot' -AsSecureString
$env:DISCORD_BOT_TOKEN = [System.Net.NetworkCredential]::new('', $secureToken).Password
$env:DISCORD_APPLICATION_ID = Read-Host 'Application ID'
$env:DISCORD_GUILD_ID = Read-Host 'ID del servidor'
try {
  .\scripts\register-discord-commands.ps1
} finally {
  Remove-Item Env:DISCORD_BOT_TOKEN, Env:DISCORD_APPLICATION_ID, Env:DISCORD_GUILD_ID -ErrorAction SilentlyContinue
  Remove-Variable secureToken -ErrorAction SilentlyContinue
}
```

El script registra `/sitio` (enlaces a inicio, proyectos, perfil de staff y contacto), `/pregunta` (respuestas fijas basadas en el portafolio, sin IA externa) y `/ticket` (abre un canal privado). No guarda ni muestra el token. La web también tiene un formulario para abrir un ticket: exige iniciar sesión en Discord y pertenecer al servidor; después crea o abre el canal privado en Discord.

### 4. Activar los avisos del formulario

En **Supabase → Database → Webhooks**, crea un webhook con nombre `discord-message-notifications`, tabla `public.messages`, evento `INSERT`, método `POST` y URL:

`https://zfnwwggnvurzmwypjijb.supabase.co/functions/v1/discord-notify`

Añade los encabezados `Content-Type: application/json` y `x-webhook-secret: <el mismo DISCORD_WEBHOOK_SECRET>`. La función solo transmite el nombre opcional y el mensaje al canal privado de Discord configurado; evita usar `@everyone` o menciones automáticas.

Prueba `/sitio`, `/pregunta` y `/ticket` en tu servidor, y luego envía un mensaje de prueba desde el formulario. Si algo falla, consulta los registros de la función/webhook; nunca pegues tokens o encabezados de autorización en el chat. Para revocar el acceso, elimina la aplicación del servidor y rota el token en Discord.

## Idioma, tema y buscadores

El sitio ofrece español e inglés, y modo oscuro o claro. La primera visita toma las preferencias del navegador; cualquier cambio se guarda para las próximas visitas. La página privada de la dashboard se excluye del rastreo y no aparece en el sitemap.

Las preferencias de idioma y tema se conservan en el almacenamiento local del navegador y no se envían al servidor.

El portafolio incluye metadatos y datos estructurados de la persona, además del sitemap y el archivo de verificación de Google Search Console. Publica los cambios y envía `https://duartedev.lat/sitemap.xml` desde Search Console para solicitar el rastreo. El posicionamiento depende de los motores de búsqueda y no se puede garantizar una posición ni una fecha de aparición; la información del perfil debe seguir siendo exacta y pública.
