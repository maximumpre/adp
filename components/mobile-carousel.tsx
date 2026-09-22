"use client"

import { useState, useEffect } from "react"

const mobileSlides = [
  {
    id: 1,
    subtitle: "YOUR BALANCE IS JUST A TEXT AWAY WHEN YOU",
    headline: "SUBSCRIBE TO SMS UPDATES!",
    description: 'Select "Text Alerts" from the Settings menu or use the Flores Assistant to enroll!',
    cta: "VIEW DETAILS",
    ctaLink: "https://www.flores247.com/sms-landing.vbhtml",
    bgImage: "/sms.jpg",
  },
  {
    id: 2,
    headline: "FROM WHEREVER, WHENEVER WITH FLORES MOBILE",
    description: "Access your balance, file a claim and more all from your phone or tablet with the Flores Mobile app.",
    cta: "VIEW DETAILS",
    ctaLink: "https://www.flores247.com/app-landing.vbhtml",
    bgImage: "/mobile.jpg",
  },
  {
    id: 3,
    headline: "DON'T KNOW YOUR PARTICIPANT ID?",
    description: "Your Participant ID (PID) is a nine digit number assigned to you when your account was created. It can be found on any communication you receive from Flores.",
    cta: "NEED LOGIN HELP?",
    ctaLink: "https://www.flores247.com/login-help.vbhtml",
    bgImage: "/pid.jpg",
  },
  {
    id: 4,
    subtitle: "FIND ANSWERS IN THE FLORES",
    headline: "RESOURCE LIBRARY!",
    bullets: [
      "What expenses are eligible?",
      "How can I file a claim?",
      "How much should I elect?",
      "Where can I use my debit card?",
    ],
    cta: "EXPLORE NOW",
    ctaLink: "https://www.flores-associates.com/resources.html",
    bgImage: "/resource-library.jpg",
  },
  {
    id: 5,
    subtitle: "SAVE TIME WITH THE",
    headline: "FLORES ASSISTANT!",
    description: "Order additional debit cards, subscribe to text updates and setup direct deposit in one easy place with the Flores Assistant!",
    additionalText: "Log in to access the Flores Assistant.",
    bgImage: "/assistant.jpg",
  },
  {
    id: 6,
    subtitle: "SHOP THE LARGEST SELECTION OF FSA-ELIGIBLE PRODUCTS.",
    bullets: [
      "Free shipping over $50",
      "100% guaranteed FSA eligibility",
      "Use your FSA card, skip the claims",
    ],
    cta: "SHOP NOW",
    ctaLink: "https://fsastore.com/?utm_source=Flores%20and%20Associates&utm_medium=TPA+Mobile+Proprietary+Banner+Login&utm_campaign=TPA+Partner&a_aid=58b5f24ca4f61",
    bgImage: "/FSA-Store.png",
  },
]

export function MobileCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mobileSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = mobileSlides[currentSlide]

  return (
    <div
      className="relative text-white min-h-[422px] bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url('${slide.bgImage}')`,
        backgroundSize: 'cover',
        aspectRatio: '330/422',
      }}
    >
      
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-blue-800/40"
        style={{
          background: 'linear-gradient(135deg, rgba(0,153,216,0.3) 0%, rgba(0,61,107,0.3) 100%)',
        }}
      />
      <div className="relative z-10 h-full flex flex-col justify-between pt-8 sm:pt-10 pb-4 px-4 sm:px-6">
        <div className="flex-1">
          {slide.subtitle && (
            <p className="text-sm sm:text-base font-medium mb-2 uppercase tracking-wide">{slide.subtitle}</p>
          )}
          {slide.headline && (
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 leading-tight uppercase">{slide.headline}</h3>
          )}
          {(slide.subtitle || slide.headline) && <hr className="w-12 border-white/50 mb-4 sm:mb-5" />}
          
          {slide.description && (
            <p className="text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed">{slide.description}</p>
          )}
          
          {slide.bullets && (
            <div className="mb-5 sm:mb-6 space-y-2.5 sm:space-y-3">
              {slide.bullets.map((bullet, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <span className="text-white mt-1 text-base sm:text-lg">✓</span>
                  <p className="text-sm sm:text-base">{bullet}</p>
                </div>
              ))}
            </div>
          )}
          
          {slide.additionalText && (
            <p className="text-sm sm:text-base mb-5 sm:mb-6">{slide.additionalText}</p>
          )}
          
          {slide.cta && (
            <a
              href={slide.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-white text-sm sm:text-base uppercase text-center"
              style={{ backgroundColor: "#F7931E" }}
            >
              {slide.cta}
            </a>
          )}
        </div>

        
        <div className="flex justify-center gap-2 mt-4 sm:mt-6">
          {mobileSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer ${i === currentSlide ? "bg-white" : "bg-white/40"
                }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentSlide ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
