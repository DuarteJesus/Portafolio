import {
  discordApi,
  isSharedSecretValid,
  jsonBody,
  jsonResponse,
} from "../_shared/discord.ts";

type MessageRecord = {
  id?: unknown;
  name?: unknown;
  message?: unknown;
  created_at?: unknown;
};

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const expectedSecret = Deno.env.get("DISCORD_WEBHOOK_SECRET") ?? "";
  const receivedSecret = request.headers.get("x-webhook-secret") ?? "";
  if (
    expectedSecret.length < 32 ||
    !isSharedSecretValid(receivedSecret, expectedSecret)
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rawBody = await request.text();
  if (rawBody.length > 16_384) return new Response("Payload too large", { status: 413 });

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: "Invalid JSON payload" }, 400);
  }

  const record = payload.record as MessageRecord | null;
  if (
    payload.type !== "INSERT" ||
    payload.schema !== "public" ||
    payload.table !== "messages" ||
    !record ||
    typeof record.message !== "string" ||
    typeof record.id !== "string"
  ) {
    return jsonResponse({ error: "Unexpected webhook payload" }, 400);
  }

  const channelId = Deno.env.get("DISCORD_NOTIFICATION_CHANNEL_ID") ?? "";
  const botToken = Deno.env.get("DISCORD_BOT_TOKEN") ?? "";
  if (!/^\d{17,20}$/.test(channelId) || !botToken) {
    console.error("Discord notification configuration is incomplete");
    return jsonResponse({ error: "Notification service is not configured" }, 500);
  }

  const message = record.message.slice(0, 2000);
  const name = typeof record.name === "string" && record.name.trim()
    ? record.name.trim().slice(0, 60)
    : "Anónimo";
  const response = await discordApi(botToken, `/channels/${channelId}/messages`, {
    method: "POST",
    body: jsonBody({
      embeds: [{
        title: "Nuevo mensaje desde duartedev.lat",
        description: message,
        fields: [{ name: "Nombre", value: name }],
        timestamp: typeof record.created_at === "string" ? record.created_at : new Date().toISOString(),
        url: "https://duartedev.lat/#contacto",
        color: 0x3478d4,
      }],
      allowed_mentions: { parse: [] },
    }),
  });

  if (!response.ok) {
    console.error("Discord notification delivery failed with status", response.status);
    return jsonResponse({ error: "Discord rejected the notification" }, 502);
  }

  return jsonResponse({ delivered: true });
});
