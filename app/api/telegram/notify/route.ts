import { NextRequest, NextResponse } from "next/server"
import { sendTelegramNotification, getClientInfo, getIPGeolocation } from "@/lib/telegram"


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, details } = body

    if (!event) {
      return NextResponse.json(
        { error: "Event is required" },
        { status: 400 }
      )
    }

    
    const { ip, userAgent } = getClientInfo(request.headers)

    
    let notificationDetails = { ...details }

    
    
    if (!notificationDetails.pageUrl) {
      const referer = request.headers.get("referer")
      const origin = request.headers.get("origin")
      const host = request.headers.get("host")
      const protocol = request.headers.get("x-forwarded-proto") || "https"
      
      let pageUrl: string | null = null
      if (referer) {
        pageUrl = referer
      } else if (origin) {
        pageUrl = origin
      } else if (host) {
        pageUrl = `${protocol}://${host}${new URL(request.url).pathname}`
      }
      
      if (pageUrl) {
        notificationDetails.pageUrl = pageUrl
      }
    }

    
    if (ip) {
      notificationDetails.ip = ip
    }
    if (userAgent) {
      notificationDetails.device = userAgent
    }

    
    if (event === "New Visitor" && ip) {
      const geoData = await getIPGeolocation(ip)
      if (geoData) {
        if (geoData.location) notificationDetails.location = geoData.location
        if (geoData.timezone) notificationDetails.timezone = geoData.timezone
        if (geoData.isp) notificationDetails.isp = geoData.isp
      }
    }

    
    await sendTelegramNotification({
      event,
      details: notificationDetails,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending Telegram notification:", error)
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    )
  }
}

