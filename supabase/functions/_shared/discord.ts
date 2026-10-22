export const DISCORD_API = "https://discord.com/api/v10";

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function hexToBytes(value: string): Uint8Array | null {
  if (!/^[\da-f]{2,}$/i.test(value) || value.length % 2 !== 0) return null;
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

export async function isDiscordRequest(request: Request, body: string): Promise<boolean> {
  const publicKey = Deno.env.get("DISCORD_PUBLIC_KEY") ?? "";
  const signature = hexToBytes(request.headers.get("x-signature-ed25519") ?? "");
  const timestamp = request.headers.get("x-signature-timestamp") ?? "";
  const seconds = Number(timestamp);

  if (
    !/^[\da-f]{64}$/i.test(publicKey) ||
    !signature ||
    signature.length !== 64 ||
    !Number.isFinite(seconds) ||
    Math.abs(Date.now() / 1000 - seconds) > 300
  ) {
    return false;
  }

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      hexToBytes(publicKey)!,
      { name: "Ed25519" },
      false,
      ["verify"],
    );
    const signed = new TextEncoder().encode(timestamp + body);
    return await crypto.subtle.verify({ name: "Ed25519" }, key, signature, signed);
  } catch (error) {
    console.error("Discord signature verification failed:", error);
    return false;
  }
}

export async function discordApi(
  token: string,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  return await fetch(`${DISCORD_API}${path}`, {
    ...init,
    headers: {
      authorization: `Bot ${token}`,
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
  });
}

export function jsonBody(value: unknown): string {
  return JSON.stringify(value);
}

export function validSnowflake(value: string | undefined): value is string {
  return typeof value === "string" && /^\d{17,20}$/.test(value);
}

export function isSharedSecretValid(received: string, expected: string): boolean {
  const left = new TextEncoder().encode(received);
  const right = new TextEncoder().encode(expected);
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}
