import { NextRequest, NextResponse } from "next/server"
import { telegramService } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as { userId?: unknown }
    const userId = typeof data.userId === "string" ? data.userId.trim() : ""
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await telegramService.sendUsernameNotification(userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending username notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
