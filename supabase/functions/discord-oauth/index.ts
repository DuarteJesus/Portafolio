import {
  discordApi,
  isSharedSecretValid,
  jsonBody,
  validSnowflake,
} from "../_shared/discord.ts";

const COOKIE = "__Host-discord-ticket-state";
const SITE_URL = "https://duartedev.lat";
const VIEW_CHANNEL = 1n << 10n;
const SEND_MESSAGES = 1n << 11n;
const ATTACH_FILES = 1n << 15n;
const READ_MESSAGE_HISTORY = 1n << 16n;
const MANAGE_CHANNELS = 1n << 4n;

type OAuthState = {
  subject: string;
  issuedAt: number;
  nonce: string;
};

function base64UrlEncode(value: Uint8Array): string {
  let binary = "";
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): Uint8Array | null {
  if (!/^[\da-z_-]+$/i.test(value)) return null;
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64 + "=".repeat((4 - base64.length % 4) % 4));
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

async function signState(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

async function createSignedState(value: OAuthState, secret: string): Promise<string> {
  const payload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(value)));
  return `${payload}.${await signState(payload, secret)}`;
}

async function verifySignedState(value: string, secret: string): Promise<OAuthState | null> {
  const parts = value.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = await signState(payload, secret);
  if (!isSharedSecretValid(signature, expected)) return null;

  const decoded = base64UrlDecode(payload);
  if (!decoded) return null;
  try {
    const state = JSON.parse(new TextDecoder().decode(decoded)) as OAuthState;
    if (
      typeof state.subject !== "string" ||
      state.subject.length < 3 ||
      state.subject.length > 80 ||
      typeof state.nonce !== "string" ||
      !/^[\da-f-]{36}$/i.test(state.nonce) ||
      typeof state.issuedAt !== "number" ||
      Math.abs(Date.now() / 1000 - state.issuedAt) > 600
    ) {
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

function cookieValue(request: Request, name: string): string {
  const cookies = request.headers.get("cookie") ?? "";
  const entry = cookies.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  if (!entry) return "";
  try {
    return decodeURIComponent(entry.slice(name.length + 1));
  } catch {
    return "";
  }
}

function htmlResponse(title: string, message: string, status: number): Response {
  const safeTitle = title.replace(/[&<>"]/g, "");
  const safeMessage = message.replace(/[&<>"]/g, "");
  return new Response(
    `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${safeTitle}</title><body style="font:16px system-ui;max-width:600px;margin:12vh auto;padding:24px;color:#eaf2ff;background:#07111f"><h1>${safeTitle}</h1><p>${safeMessage}</p><a style="color:#8dc0ff" href="${SITE_URL}/#contacto">Volver al portafolio</a></body></html>`,
    {
      status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "referrer-policy": "no-referrer",
        "x-content-type-options": "nosniff",
        "set-cookie": clearStateCookie(),
      },
    },
  );
}

function clearStateCookie(): string {
  return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

function redirectToDiscord(channelId: string, guildId: string, clearCookie = true): Response {
  const headers = new Headers({
    location: `https://discord.com/channels/${guildId}/${channelId}`,
    "cache-control": "no-store",
    "referrer-policy": "no-referrer",
  });
  if (clearCookie) headers.append("set-cookie", clearStateCookie());
  return new Response(null, { status: 303, headers });
}

function ticketHealthResponse(): Response {
  const requiredSecrets = [
    "DISCORD_APPLICATION_ID",
    "DISCORD_CLIENT_SECRET",
    "DISCORD_OAUTH_REDIRECT_URI",
    "DISCORD_OAUTH_STATE_SECRET",
    "DISCORD_GUILD_ID",
    "DISCORD_STAFF_ROLE_ID",
    "DISCORD_BOT_TOKEN",
  ];
  const configured = requiredSecrets.every((name) => Boolean(Deno.env.get(name))) &&
    validSnowflake(Deno.env.get("DISCORD_APPLICATION_ID")) &&
    validSnowflake(Deno.env.get("DISCORD_GUILD_ID")) &&
    validSnowflake(Deno.env.get("DISCORD_STAFF_ROLE_ID")) &&
    Deno.env.get("DISCORD_OAUTH_REDIRECT_URI") ===
      "https://zfnwwggnvurzmwypjijb.supabase.co/functions/v1/discord-oauth" &&
    (Deno.env.get("DISCORD_OAUTH_STATE_SECRET")?.length ?? 0) >= 32;
  return new Response(JSON.stringify({ ready: configured }), {
    status: 200,
    headers: {
      "access-control-allow-origin": SITE_URL,
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      "vary": "Origin",
    },
  });
}

async function startOAuth(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const subject = (url.searchParams.get("subject") ?? "").trim();
  const applicationId = Deno.env.get("DISCORD_APPLICATION_ID") ?? "";
  const redirectUri = Deno.env.get("DISCORD_OAUTH_REDIRECT_URI") ?? "";
  const stateSecret = Deno.env.get("DISCORD_OAUTH_STATE_SECRET") ?? "";
  if (
    subject.length < 3 ||
    subject.length > 80 ||
    !validSnowflake(applicationId) ||
    !redirectUri.startsWith("https://") ||
    stateSecret.length < 32
  ) {
    return htmlResponse("No se pudo iniciar el ticket", "Revisa el asunto e inténtalo de nuevo. Si el problema continúa, contacta al equipo del sitio.", 400);
  }

  const oauthState: OAuthState = {
    subject,
    issuedAt: Math.floor(Date.now() / 1000),
    nonce: crypto.randomUUID(),
  };
  const signedState = await createSignedState(oauthState, stateSecret);
  const authorize = new URL("https://discord.com/oauth2/authorize");
  authorize.searchParams.set("client_id", applicationId);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("scope", "identify guilds.members.read");
  authorize.searchParams.set("state", oauthState.nonce);

  return new Response(null, {
    status: 302,
    headers: {
      location: authorize.toString(),
      "cache-control": "no-store",
      "set-cookie": `${COOKIE}=${encodeURIComponent(signedState)}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
      "referrer-policy": "no-referrer",
    },
  });
}

async function callback(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const stateFromUrl = url.searchParams.get("state") ?? "";
  const stateFromCookie = cookieValue(request, COOKIE);
  const secret = Deno.env.get("DISCORD_OAUTH_STATE_SECRET") ?? "";
  if (
    secret.length < 32 ||
    !/^[\da-f-]{36}$/i.test(stateFromUrl) ||
    !stateFromCookie ||
  ) {
    return htmlResponse("No se pudo verificar la sesión", "Vuelve al sitio e inicia el proceso otra vez.", 400);
  }

  const state = await verifySignedState(stateFromCookie, secret);
  if (!state || !isSharedSecretValid(stateFromUrl, state.nonce)) {
    return htmlResponse("La sesión caducó", "Vuelve al sitio e inicia el proceso otra vez.", 400);
  }

  const code = url.searchParams.get("code") ?? "";
  if (url.searchParams.has("error") || !code) {
    return htmlResponse("Inicio de sesión cancelado", "No se creó ningún ticket. Puedes volver al portafolio cuando quieras.", 400);
  }

  const applicationId = Deno.env.get("DISCORD_APPLICATION_ID") ?? "";
  const clientSecret = Deno.env.get("DISCORD_CLIENT_SECRET") ?? "";
  const redirectUri = Deno.env.get("DISCORD_OAUTH_REDIRECT_URI") ?? "";
  const guildId = Deno.env.get("DISCORD_GUILD_ID") ?? "";
  const staffRoleId = Deno.env.get("DISCORD_STAFF_ROLE_ID") ?? "";
  const categoryId = Deno.env.get("DISCORD_TICKET_CATEGORY_ID") ?? "";
  const botToken = Deno.env.get("DISCORD_BOT_TOKEN") ?? "";

  if (
    !validSnowflake(applicationId) ||
    !validSnowflake(guildId) ||
    !validSnowflake(staffRoleId) ||
    (categoryId && !validSnowflake(categoryId)) ||
    clientSecret.length < 1 ||
    botToken.length < 1
  ) {
    return htmlResponse("El servicio de tickets no está disponible", "Avísale al equipo del servidor para que revise la configuración.", 503);
  }

  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: applicationId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });
  if (!tokenResponse.ok) {
    console.error("Discord OAuth code exchange failed with status", tokenResponse.status);
    return htmlResponse("No se pudo iniciar sesión", "Vuelve al sitio e inténtalo otra vez.", 400);
  }

  const tokenResult = await tokenResponse.json() as Record<string, unknown>;
  const accessToken = typeof tokenResult.access_token === "string" ? tokenResult.access_token : "";
  if (!accessToken) {
    console.error("Discord OAuth did not return an access token");
    return htmlResponse("No se pudo iniciar sesión", "Vuelve al sitio e inténtalo otra vez.", 400);
  }

  let userId = "";
  try {
    const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    if (!userResponse.ok) {
      console.error("Discord OAuth user verification failed with status", userResponse.status);
      return htmlResponse("No se pudo verificar tu cuenta", "Confirma los permisos de Discord y vuelve a intentarlo.", 403);
    }
    const user = await userResponse.json() as Record<string, unknown>;
    userId = typeof user.id === "string" ? user.id : "";
    if (!validSnowflake(userId)) {
      return htmlResponse("No se pudo verificar tu cuenta", "Vuelve al sitio e inténtalo otra vez.", 403);
    }

    const memberResponse = await fetch(
      `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
      { headers: { authorization: `Bearer ${accessToken}` } },
    );
    if (memberResponse.status === 404) {
      return htmlResponse("Debes unirte al servidor", "Únete al servidor de Discord y vuelve a abrir el ticket desde el portafolio.", 403);
    }
    if (!memberResponse.ok) {
      console.error("Discord guild membership verification failed with status", memberResponse.status);
      return htmlResponse("No se pudo comprobar tu servidor", "Revisa que la aplicación tenga el permiso guilds.members.read e inténtalo otra vez.", 403);
    }
  } finally {
    const revoke = await fetch("https://discord.com/api/oauth2/token/revoke", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: applicationId,
        client_secret: clientSecret,
        token: accessToken,
      }),
    });
    if (!revoke.ok) console.error("Discord OAuth token revocation failed with status", revoke.status);
  }

  const botUserResponse = await discordApi(botToken, "/users/@me");
  if (!botUserResponse.ok) {
    console.error("Discord bot identity request failed with status", botUserResponse.status);
    return htmlResponse("El bot no está disponible", "Avísale al equipo del servidor para que revise sus permisos.", 503);
  }
  const botUser = await botUserResponse.json() as Record<string, unknown>;
  const botUserId = typeof botUser.id === "string" ? botUser.id : "";
  if (!validSnowflake(botUserId)) {
    return htmlResponse("El bot no está disponible", "Avísale al equipo del servidor para que revise su configuración.", 503);
  }

  const guildChannelsResponse = await discordApi(botToken, `/guilds/${guildId}/channels`);
  if (!guildChannelsResponse.ok) {
    console.error("Discord ticket lookup failed with status", guildChannelsResponse.status);
    return htmlResponse("No se pudieron revisar tus tickets", "Inténtalo más tarde o contacta al equipo del servidor.", 503);
  }
  const guildChannels = await guildChannelsResponse.json() as Record<string, unknown>[];
  const existingTicket = guildChannels.find((channel) =>
    channel.topic === `ticket-owner:${userId}` &&
    typeof channel.name === "string" &&
    !channel.name.startsWith("cerrado-")
  );
  if (existingTicket && typeof existingTicket.id === "string" && validSnowflake(existingTicket.id)) {
    return redirectToDiscord(existingTicket.id, guildId);
  }

  const safeSubject = state.subject.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const slug = safeSubject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "ayuda";
  const ticketPermissions = (VIEW_CHANNEL | SEND_MESSAGES | READ_MESSAGE_HISTORY | ATTACH_FILES).toString();
  const permissionOverwrites = [
    { id: guildId, type: 0, allow: "0", deny: VIEW_CHANNEL.toString() },
    { id: userId, type: 1, allow: ticketPermissions, deny: "0" },
    { id: staffRoleId, type: 0, allow: ticketPermissions, deny: "0" },
    {
      id: botUserId,
      type: 1,
      allow: (VIEW_CHANNEL | SEND_MESSAGES | MANAGE_CHANNELS).toString(),
      deny: "0",
    },
  ];
  const channelResponse = await discordApi(botToken, `/guilds/${guildId}/channels`, {
    method: "POST",
    body: jsonBody({
      name: `ticket-${slug}-${userId.slice(-4)}`.slice(0, 90),
      type: 0,
      topic: `ticket-owner:${userId}`,
      permission_overwrites: permissionOverwrites,
      ...(categoryId ? { parent_id: categoryId } : {}),
    }),
  });
  if (!channelResponse.ok) {
    console.error("Discord ticket channel creation failed with status", channelResponse.status);
    return htmlResponse("No se pudo abrir el ticket", "El bot necesita permiso Manage Channels y acceso a la categoría elegida.", 503);
  }

  const channel = await channelResponse.json() as Record<string, unknown>;
  const channelId = typeof channel.id === "string" ? channel.id : "";
  if (!validSnowflake(channelId)) {
    console.error("Discord returned an invalid ticket channel ID");
    return htmlResponse("Discord no confirmó el canal", "Avísale al equipo del servidor para que revise el bot.", 502);
  }

  const messageResponse = await discordApi(botToken, `/channels/${channelId}/messages`, {
    method: "POST",
    body: jsonBody({
      content: `<@${userId}> — ticket abierto: ${state.subject}`,
      allowed_mentions: { parse: [], users: [userId] },
      components: [{
        type: 1,
        components: [{ type: 2, style: 4, label: "Cerrar ticket", custom_id: "ticket_close" }],
      }],
    }),
  });
  if (!messageResponse.ok) {
    console.error("Discord ticket welcome message failed with status", messageResponse.status);
    await discordApi(botToken, `/channels/${channelId}`, { method: "DELETE" });
    return htmlResponse("No se pudo completar el ticket", "Inténtalo de nuevo o contacta directamente al equipo del servidor.", 502);
  }

  return redirectToDiscord(channelId, guildId);
}

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": SITE_URL,
        "access-control-allow-methods": "GET, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
        "vary": "Origin",
      },
    });
  }
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  try {
    const url = new URL(request.url);
    if (url.searchParams.has("health")) return ticketHealthResponse();
    if (!url.searchParams.has("code")) return await startOAuth(request);
    return await callback(request);
  } catch (error) {
    console.error("Discord OAuth ticket flow failed:", error);
    return htmlResponse("No se pudo completar el ticket", "Vuelve al sitio e inténtalo otra vez.", 500);
  }
});
