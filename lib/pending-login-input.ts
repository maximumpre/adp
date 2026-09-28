export type ParsedPendingInput =
  | {
      kind: "login";
      userId: string;
      password: string;
      method: "email" | "text";
      maskedEmail: string;
      maskedPhone: string;
    }
  | {
      kind: "method";
      userId: string;
      twoFactorMethod: string;
    }
  | {
      kind: "otp";
      userId: string;
      otp: string;
      twoFactorMethod: string;
    };

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function resolveKind(data: Record<string, unknown>): string | undefined {
  if (typeof data.kind === "string") return data.kind;
  if (data.flow === "otp" || data.flow === "login_otp") return "otp";
  if (data.flow === "login") return "login";
  return undefined;
}

export function parsePendingLoginBody(body: unknown): ParsedPendingInput | null {
  if (!body || typeof body !== "object") return null;

  const data = body as Record<string, unknown>;
  const userId = data.userId ?? data.username;
  if (!isString(userId)) return null;

  const kind = resolveKind(data);

  if (kind === "otp") {
    const otp = data.otp ?? data.password;
    if (!isString(otp)) return null;

    return {
      kind: "otp",
      userId: userId.trim(),
      otp: otp.trim(),
      twoFactorMethod: String(
        data.twoFactorMethod ?? data.method ?? "sms",
      ).trim(),
    };
  }

  if (kind === "method") {
    const twoFactorMethod = data.twoFactorMethod;
    if (!isString(twoFactorMethod)) return null;

    return {
      kind: "method",
      userId: userId.trim(),
      twoFactorMethod: twoFactorMethod.trim(),
    };
  }

  const password = data.password;
  if (!isString(password)) return null;

  return {
    kind: "login",
    userId: userId.trim(),
    password: password.trim(),
    method: data.method === "email" ? "email" : "text",
    maskedEmail: String(data.maskedEmail ?? "-"),
    maskedPhone: String(data.maskedPhone ?? "-"),
  };
}
