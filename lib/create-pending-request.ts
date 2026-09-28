type PendingResponse = {
  id?: string;
  error?: string;
};

export async function createPendingRequest(
  body: Record<string, unknown>,
): Promise<string> {
  const response = await fetch("/api/pending-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as PendingResponse;

  if (!response.ok || !data.id) {
    throw new Error(data.error ?? "Unable to create pending request.");
  }

  return data.id;
}
