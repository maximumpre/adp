import { NextRequest, NextResponse } from "next/server"
import { telegramService } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = body?.userId
    const { isSecondOtp } = body
    await telegramService.sendResendCodeNotification({
      userId: typeof userId === "string" ? userId.trim() : "",
      isSecondOtp: isSecondOtp || false,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to send resend code notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
