import {
  discordApi,
  isDiscordRequest,
  jsonBody,
  jsonResponse,
  validSnowflake,
} from "../_shared/discord.ts";

declare const EdgeRuntime: {
  waitUntil(promise: Promise<unknown>): void;
};

const SITE = "https://duartedev.lat";
const EPHEMERAL = 64;
const VIEW_CHANNEL = 1n << 10n;
const SEND_MESSAGES = 1n << 11n;
const ATTACH_FILES = 1n << 15n;
const READ_MESSAGE_HISTORY = 1n << 16n;
const MANAGE_CHANNELS = 1n << 4n;

type DiscordObject = Record<string, unknown>;

function interactionUser(interaction: DiscordObject): DiscordObject | null {
  const member = interaction.member as DiscordObject | undefined;
  return (member?.user as DiscordObject | undefined) ??
    (interaction.user as DiscordObject | undefined) ?? null;
}

function interactionRoles(interaction: DiscordObject): string[] {
  const member = interaction.member as DiscordObject | undefined;
  return Array.isArray(member?.roles) ? member.roles.filter((role): role is string => typeof role === "string") : [];
}

function optionValue(interaction: DiscordObject, name: string): string {
  const data = interaction.data as DiscordObject | undefined;
  const options = Array.isArray(data?.options) ? data.options as DiscordObject[] : [];
  const option = options.find((item) => item.name === name);
  return typeof option?.value === "string" ? option.value : "";
}

function reply(content: string, ephemeral = true): Response {
  return jsonResponse({ type: 4, data: { content, ...(ephemeral ? { flags: EPHEMERAL } : {}) } });
}

function interactionIsEnglish(interaction: DiscordObject): boolean {
  const locale = typeof interaction.locale === "string" ? interaction.locale : "";
  return locale.startsWith("en");
}

function faqAnswer(question: string, english: boolean): string {
  const normalized = question.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (/contact|correo|email|mensaje|message|escrib|write/.test(normalized)) {
    return english
      ? `Use the contact form or email Duarte at duartedigital@icloud.com.\n${SITE}/#contacto`
      : `Puedes escribir desde el formulario de contacto o por correo: duartedigital@icloud.com\n${SITE}/#contacto`;
  }
  if (/proyecto|project|github|codigo|code|finanza|finance|calculadora|calculator/.test(normalized)) {
    return english
      ? `Explore the portfolio projects and their GitHub links here:\n${SITE}/#proyectos`
      : `En el portafolio puedes explorar los proyectos y sus enlaces a GitHub:\n${SITE}/#proyectos`;
  }
  if (/staff|supercraft|moderador|moderator|comunidad|community/.test(normalized)) {
    return english
      ? `Duarte's SuperCraft staff profile is here:\n${SITE}/staff/`
      : `El perfil de staff de SuperCraft está aquí:\n${SITE}/staff/`;
  }
  if (/idioma|language|ingles|english|espanol|spanish|tema|theme|oscuro|dark|claro|light/.test(normalized)) {
    return english
      ? `The website supports Spanish and English, plus light and dark themes. Use the preference controls in the page header:\n${SITE}`
      : `La web permite cambiar entre español e inglés, y entre tema claro y oscuro. Encontrarás los controles de preferencias en el encabezado:\n${SITE}`;
  }
  if (/quien|who|duarte|desarrollador|developer|estudi|student|barranquilla|colombia/.test(normalized)) {
    return english
      ? `Duarte is a student and aspiring web developer from Colombia. Read about his background here:\n${SITE}/#sobre-mi`
      : `Duarte es estudiante y desarrollador web en formación en Colombia. Puedes leer su perfil y trayectoria aquí:\n${SITE}/#sobre-mi`;
  }
  return english
    ? `I don't have a verified answer for that yet. Browse the site or contact Duarte:\n${SITE}\n${SITE}/#contacto`
    : `No tengo una respuesta confirmada para eso. Puedes consultar el sitio o escribirle a Duarte:\n${SITE}\n${SITE}/#contacto`;
}

async function editInteractionResponse(
  applicationId: string,
  token: string,
  body: DiscordObject,
): Promise<void> {
  const response = await fetch(
    `https://discord.com/api/v10/webhooks/${applicationId}/${token}/messages/@original`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: jsonBody(body),
    },
  );
  if (!response.ok) {
    console.error("Discord interaction follow-up failed with status", response.status);
  }
}

async function followup(
  applicationId: string,
  token: string,
  content: string,
): Promise<void> {
  const response = await fetch(
    `https://discord.com/api/v10/webhooks/${applicationId}/${token}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: jsonBody({ content, flags: EPHEMERAL, allowed_mentions: { parse: [] } }),
    },
  );
  if (!response.ok) console.error("Discord interaction follow-up failed with status", response.status);
}

function channelSlug(value: string): string {
  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalized.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "ayuda";
}

async function createTicket(interaction: DiscordObject): Promise<void> {
  const applicationId = String(interaction.application_id ?? "");
  const token = String(interaction.token ?? "");
  const user = interactionUser(interaction);
  const userId = typeof user?.id === "string" ? user.id : "";
  const guildId = String(interaction.guild_id ?? "");
  const botToken = Deno.env.get("DISCORD_BOT_TOKEN") ?? "";
  const staffRoleId = Deno.env.get("DISCORD_STAFF_ROLE_ID") ?? "";
  const categoryId = Deno.env.get("DISCORD_TICKET_CATEGORY_ID") ?? "";
  const guildSetting = Deno.env.get("DISCORD_GUILD_ID") ?? "";
  const botUserResponse = await discordApi(botToken, "/users/@me");

  if (!botUserResponse.ok) {
    await editInteractionResponse(applicationId, token, { content: "No pude verificar la configuración del bot. Avísale al equipo del servidor." });
    console.error("Discord bot identity request failed with status", botUserResponse.status);
    return;
  }

  const botUser = await botUserResponse.json() as DiscordObject;
  const botUserId = String(botUser.id ?? "");
  if (
    !validSnowflake(userId) ||
    !validSnowflake(guildSetting) ||
    guildId !== guildSetting ||
    !validSnowflake(staffRoleId) ||
    !validSnowflake(botUserId) ||
    (categoryId && !validSnowflake(categoryId))
  ) {
    await editInteractionResponse(applicationId, token, { content: "El servidor o el rol de soporte no está configurado correctamente." });
    console.error("Discord ticket configuration is incomplete or the interaction came from a different guild");
    return;
  }

  const existingChannelsResponse = await discordApi(botToken, `/guilds/${guildId}/channels`);
  if (!existingChannelsResponse.ok) {
    console.error("Discord ticket lookup failed with status", existingChannelsResponse.status);
    await editInteractionResponse(applicationId, token, { content: "No pude revisar tus tickets abiertos. Inténtalo más tarde." });
    return;
  }
  const existingChannels = await existingChannelsResponse.json() as DiscordObject[];
  const existingTicket = existingChannels.find((channel) =>
    channel.topic === `ticket-owner:${userId}` &&
    typeof channel.name === "string" &&
    !channel.name.startsWith("cerrado-")
  );
  if (existingTicket && typeof existingTicket.id === "string" && validSnowflake(existingTicket.id)) {
    await editInteractionResponse(applicationId, token, {
      content: `Ya tienes un ticket abierto: <#${existingTicket.id}>.`,
      allowed_mentions: { parse: [] },
    });
    return;
  }

  const subject = optionValue(interaction, "asunto");
  const username = typeof user?.username === "string" ? user.username : "usuario";
  const everyoneRoleId = guildId;
  const ticketPermissions = (VIEW_CHANNEL | SEND_MESSAGES | READ_MESSAGE_HISTORY | ATTACH_FILES).toString();
  const overwrites = [
    { id: everyoneRoleId, type: 0, allow: "0", deny: VIEW_CHANNEL.toString() },
    { id: userId, type: 1, allow: ticketPermissions, deny: "0" },
    { id: staffRoleId, type: 0, allow: ticketPermissions, deny: "0" },
    {
      id: botUserId,
      type: 1,
      allow: (VIEW_CHANNEL | SEND_MESSAGES | MANAGE_CHANNELS).toString(),
      deny: "0",
    },
  ];
  const channelBody: DiscordObject = {
    name: `ticket-${channelSlug(subject || username)}-${userId.slice(-4)}`.slice(0, 90),
    type: 0,
    topic: `ticket-owner:${userId}`,
    permission_overwrites: overwrites,
    ...(categoryId ? { parent_id: categoryId } : {}),
  };

  const channelResponse = await discordApi(botToken, `/guilds/${guildId}/channels`, {
    method: "POST",
    body: jsonBody(channelBody),
  });
  if (!channelResponse.ok) {
    console.error("Discord ticket channel creation failed with status", channelResponse.status);
    await editInteractionResponse(applicationId, token, { content: "No pude abrir el ticket. Revisa que el bot tenga Manage Channels y acceso a la categoría." });
    return;
  }

  const channel = await channelResponse.json() as DiscordObject;
  const channelId = String(channel.id ?? "");
  if (!validSnowflake(channelId)) {
    console.error("Discord returned an invalid ticket channel ID");
    await editInteractionResponse(applicationId, token, { content: "Discord no confirmó el canal del ticket. Avísale al equipo." });
    return;
  }

  const messageResponse = await discordApi(botToken, `/channels/${channelId}/messages`, {
    method: "POST",
    body: jsonBody({
      content: `<@${userId}> — ticket abierto${subject ? `: ${subject.slice(0, 500)}` : "."}`,
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
    await editInteractionResponse(applicationId, token, { content: "No pude terminar de preparar el ticket. Inténtalo otra vez." });
    return;
  }

  await editInteractionResponse(applicationId, token, {
    content: `Ticket abierto: <#${channelId}>. Solo tú y el equipo autorizado pueden verlo.`,
    allowed_mentions: { parse: [] },
  });
}

async function closeTicket(interaction: DiscordObject): Promise<void> {
  const applicationId = String(interaction.application_id ?? "");
  const token = String(interaction.token ?? "");
  const user = interactionUser(interaction);
  const userId = typeof user?.id === "string" ? user.id : "";
  const guildId = String(interaction.guild_id ?? "");
  const channelId = String(interaction.channel_id ?? "");
  const message = interaction.message as DiscordObject | undefined;
  const messageId = typeof message?.id === "string" ? message.id : "";
  const staffRoleId = Deno.env.get("DISCORD_STAFF_ROLE_ID") ?? "";
  const configuredGuildId = Deno.env.get("DISCORD_GUILD_ID") ?? "";
  const botToken = Deno.env.get("DISCORD_BOT_TOKEN") ?? "";

  if (
    guildId !== configuredGuildId ||
    !validSnowflake(userId) ||
    !validSnowflake(channelId) ||
    !validSnowflake(messageId) ||
    !validSnowflake(staffRoleId)
  ) {
    await followup(applicationId, token, "No se pudo verificar este ticket.");
    return;
  }

  const channelResponse = await discordApi(botToken, `/channels/${channelId}`);
  if (!channelResponse.ok) {
    await followup(applicationId, token, "No pude verificar el canal del ticket.");
    console.error("Discord ticket verification failed with status", channelResponse.status);
    return;
  }

  const channel = await channelResponse.json() as DiscordObject;
  const ticketOwnerId = typeof channel.topic === "string" &&
      channel.topic.startsWith("ticket-owner:")
    ? channel.topic.slice("ticket-owner:".length)
    : "";
  const ownerMatch = ticketOwnerId === userId;
  const isStaff = interactionRoles(interaction).includes(staffRoleId);
  if (
    channel.guild_id !== configuredGuildId ||
    !validSnowflake(ticketOwnerId) ||
    (!ownerMatch && !isStaff)
  ) {
    await followup(applicationId, token, "Solo quien abrió el ticket o el equipo de soporte puede cerrarlo.");
    return;
  }

  const permissionResponse = await discordApi(
    botToken,
    `/channels/${channelId}/permissions/${ticketOwnerId}`,
    {
      method: "PUT",
      body: jsonBody({
        type: 1,
        allow: (VIEW_CHANNEL | READ_MESSAGE_HISTORY).toString(),
        deny: SEND_MESSAGES.toString(),
      }),
    },
  );
  if (!permissionResponse.ok) {
    console.error("Discord ticket permission update failed with status", permissionResponse.status);
    await followup(applicationId, token, "No pude cerrar el ticket. Revisa los permisos del bot.");
    return;
  }

  const newName = `cerrado-${String(channel.name ?? "ticket").replace(/^cerrado-/, "").slice(0, 85)}`;
  const renameResponse = await discordApi(botToken, `/channels/${channelId}`, {
    method: "PATCH",
    body: jsonBody({ name: newName }),
  });
  if (!renameResponse.ok) {
    console.error("Discord ticket rename failed with status", renameResponse.status);
  }

  const originalComponents = Array.isArray(message?.components) ? message.components as DiscordObject[] : [];
  const components = originalComponents.map((row) => {
    const rowComponents = Array.isArray(row.components) ? row.components as DiscordObject[] : [];
    return {
      ...row,
      components: rowComponents.map((button) => ({ ...button, disabled: true, label: "Ticket cerrado" })),
    };
  });
  const messageResponse = await discordApi(botToken, `/channels/${channelId}/messages/${messageId}`, {
    method: "PATCH",
    body: jsonBody({ components }),
  });
  if (!messageResponse.ok) {
    console.error("Discord ticket button update failed with status", messageResponse.status);
  }
  await followup(applicationId, token, "Ticket cerrado. El canal permanece disponible para consulta.");
}

async function handleInteraction(interaction: DiscordObject): Promise<Response> {
  if (interaction.type === 1) return jsonResponse({ type: 1 });

  if (interaction.type === 3) {
    const data = interaction.data as DiscordObject | undefined;
    if (data?.custom_id !== "ticket_close") return reply("Este botón ya no está disponible.");
    EdgeRuntime.waitUntil(
      closeTicket(interaction).catch(async (error: unknown) => {
        console.error("Discord ticket closure failed:", error);
        await followup(
          String(interaction.application_id ?? ""),
          String(interaction.token ?? ""),
          "No pude cerrar el ticket. Avísale al equipo de soporte.",
        );
      }),
    );
    return jsonResponse({ type: 6 });
  }

  if (interaction.type !== 2) return reply("Tipo de interacción no compatible.");

  const guildId = String(interaction.guild_id ?? "");
  if (!validSnowflake(guildId) || guildId !== Deno.env.get("DISCORD_GUILD_ID")) {
    return reply("Este bot solo está habilitado en el servidor configurado.");
  }

  const command = interaction.data as DiscordObject | undefined;
  const commandName = typeof command?.name === "string" ? command.name : "";
  const english = interactionIsEnglish(interaction);
  if (commandName === "sitio") {
    const destinations: Record<string, string> = {
      inicio: `${SITE}/`,
      proyectos: `${SITE}/#proyectos`,
      staff: `${SITE}/staff/`,
      contacto: `${SITE}/#contacto`,
    };
    const destination = destinations[optionValue(interaction, "seccion")] ?? `${SITE}/`;
    return reply(english ? `Here is the link: ${destination}` : `Aquí tienes el enlace: ${destination}`);
  }

  if (commandName === "pregunta") {
    return reply(faqAnswer(optionValue(interaction, "pregunta").slice(0, 500), english));
  }

  if (commandName === "ticket") {
    EdgeRuntime.waitUntil(
      createTicket(interaction).catch(async (error: unknown) => {
        console.error("Discord ticket creation failed:", error);
        await editInteractionResponse(
          String(interaction.application_id ?? ""),
          String(interaction.token ?? ""),
          { content: "No pude abrir el ticket. Avísale al equipo del servidor." },
        );
      }),
    );
    return jsonResponse({ type: 5, data: { flags: EPHEMERAL } });
  }

  return reply("No reconozco ese comando. Prueba `/sitio`, `/pregunta` o `/ticket`.");
}

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const body = await request.text();
  if (body.length > 32_768) return new Response("Payload too large", { status: 413 });
  if (!(await isDiscordRequest(request, body))) return new Response("Invalid request signature", { status: 401 });

  try {
    const interaction = JSON.parse(body) as DiscordObject;
    return await handleInteraction(interaction);
  } catch (error) {
    console.error("Discord interaction processing failed:", error);
    return jsonResponse({ type: 4, data: { content: "Ocurrió un error al procesar el comando.", flags: EPHEMERAL } });
  }
});
