import type { ComponentPropsWithoutRef } from "react"

export function FloresLogo({
  className = "",
  imageSrc = "/Experience.svg",
  alt = "Flores - Better Benefits Experience",
}: {
  className?: string
  imageSrc?: string
  alt?: string
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className="w-auto h-16 md:h-20"
      />
    </div>
  )
}
