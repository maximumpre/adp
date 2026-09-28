import adpLogo from "../adp_login/Screenshot 2026-07-06 122158.png"
import { SITE_DISPLAY_NAME } from "@/lib/site-url"

export function AdpLogo({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <img
      src={adpLogo.src}
      alt={SITE_DISPLAY_NAME}
      className={className}
      style={{ maxHeight: 55, width: "auto", objectFit: "contain", ...style }}
    />
  )
}
