import { NextRequest, NextResponse } from "next/server"
import { telegramService } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await telegramService.sendMethodNotification({
      userId: String(data?.userId ?? ""),
      method: String(data?.method ?? ""),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending method notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
