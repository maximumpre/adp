export const LOGIN_SESSION = {
  verify: "adp_verify",
  identity: "adp_identity",
  otp2: "adp_otp2",
  method: "adp_verify_method",
} as const

export const LOGIN_REDIRECT_URL =
  process.env.NEXT_PUBLIC_REDIRECT_URL ??
  "https://online.adp.com/signin/v1/?APPID=RDBX&productId=80e309c3-70c6-bae1-e053-3505430b5495&returnURL=https://my.adp.com/&callingAppId=RDBX&TARGET=-SM-https://my.adp.com/"
