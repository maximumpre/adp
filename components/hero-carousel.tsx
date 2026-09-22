"use client"

import { useState, useEffect } from "react"

const slides = [
  {
    id: 1,
    subtitle: "YOUR BALANCE IS JUST A TEXT AWAY WHEN YOU",
    headline: "SUBSCRIBE TO\nSMS UPDATES!",
    description: 'Select "Text Alerts" from the Settings menu or use the Flores Assistant to enroll!',
    cta: "+ View Details",
    ctaLink: "https://www.flores247.com/sms-landing.vbhtml",
    bgColor: "#FAF9F0", 
    bgImage: "/sms-bg.svg",
    fgImage: "/sms-img.svg",
    width: 663,
    height: 759,
    textColor: "#FFFFFF", 
    ctaColor: "#FF5E5E", 
  },
  {
    id: 2,
    subtitle: "",
    headline: "FROM WHEREVER,\nWHENEVER WITH\nFLORES MOBILE",
    description: "Access your balance, file a claim and more all from your phone or tablet with the Flores Mobile app.",
    cta: "+ View Details",
    ctaLink: "https://www.flores247.com/app-landing.vbhtml",
    bgColor: "#FFFFFF", 
    bgImage: "/flores-mobile-bg.svg",
    fgImage: "/flores-mobile.svg",
    width: 948,
    height: 678,
    textColor: "#29B6D1", 
    ctaColor: "#FF5E5E", 
  },
  {
    id: 3,
    subtitle: "DON'T KNOW YOUR",
    headline: "PARTICIPANT ID?",
    description:
      "Your Participant ID (PID) is a nine digit number assigned to you when your account was created. It can be found on any communication you receive from Flores.",
    cta: "+ Need Login Help?",
    ctaLink: "https://www.flores247.com/login-help.vbhtml",
    bgColor: "#FAF9F0", 
    bgImage: "/nature-bg.svg",
    fgImage: "/nature-fg.svg",
    width: 984,
    height: 714,
    textColor: "#29B6D1", 
    ctaColor: "#6A4C9C", 
  },
  {
    id: 4,
    subtitle: "CALCULATE YOUR SAVINGS WITH",
    headline: "FLORES SAVINGS\nCALCULATORS",
    description:
      "Wondering how much you save when you participate in a Flores reimbursement plan? Calculate your savings with our convenient calculator tools!",
    cta: "+ Calculate Now",
    ctaLink: "https://www.flores-associates.com/resources.html",
    bgColor: "#0E5B94", 
    bgImage: "/calc-bg.svg",
    fgImage: "/calc-img.svg",
    width: 853,
    height: 567,
    textColor: "#FFFFFF", 
    ctaColor: "#F39200", 
  },
  {
    id: 5,
    subtitle: "HOW TO LEARN ABOUT HSAs",
    headline: "",
    description:
      "Are you considering an HSA? Flores has resources to assist you! You can view available HSA materials on our Resource Library.",
    cta: "+ HSA Resources",
    ctaLink: "https://www.flores-associates.com/resources.html",
    bgColor: "#E6F5FD", 
    bgImage: "",
    fgImage: "/COVID-resources.svg",
    width: 805,
    height: 590,
    textColor: "#004F85", 
    ctaColor: "#004F85", 
  },
  {
    id: 6,
    subtitle: "OVER-THE-COUNTER (OTC) MEDICATIONS AND",
    headline: "MENSTRUAL CARE\nPRODUCTS ARE\nNOW ELIGIBLE!",
    description: "OTC medication and menstrual care products are now reimbursable from certain tax-advantaged plans.",
    cta: "+ View Details",
    ctaLink: "https://www.flores-associates.com/fsaforms/OTC-and-Menstrual-Care-Guidance-Flyer.pdf",
    bgColor: "#AEC2F5", 
    bgImage: "/fsa-store-bg.svg",
    fgImage: "/fsa-store-fg.svg",
    width: 758,
    height: 531,
    textColor: "#FFFFFF", 
    ctaColor: "#5548C7", 
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[currentSlide]
  const textColor = slide.textColor || "white"
  const ctaColor = (slide as any).ctaColor || "#F7931E"

  return (
    <div
      className="h-full relative overflow-hidden"
      style={{
        backgroundColor: slide.bgColor,
        backgroundImage: slide.bgImage ? `url('${slide.bgImage}')` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      
      <div className="relative z-10 h-full flex items-start pt-24 px-8 xl:px-16">
        <div className="max-w-md">
          {slide.subtitle && (
            <p className="text-base font-semibold mb-2 uppercase tracking-wide" style={{ color: textColor }}>
              {slide.subtitle}
            </p>
          )}
          {slide.headline && (
            <h1
              className="text-4xl xl:text-5xl font-normal mb-6 leading-tight whitespace-pre-line uppercase"
              style={{ color: textColor }}
            >
              {slide.headline}
            </h1>
          )}
          <div className="w-full h-px mb-6 opacity-30" style={{ backgroundColor: textColor }} />
          <p className="text-lg mb-8 leading-relaxed whitespace-pre-line" style={{ color: textColor }}>
            {slide.description}
          </p>
          <a
            href={slide.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold hover:underline italic"
            style={{ color: ctaColor }}
          >
            {slide.cta}
          </a>
        </div>
      </div>

      
      <div
        className="absolute right-0 bottom-0"
        style={{
          width: `${slide.width}px`,
          height: `${slide.height}px`,
          maxWidth: '85%', 
          maxHeight: '95%' 
        }}
      >
        <img
          src={slide.fgImage}
          alt={slide.headline ? `${slide.headline} - ${slide.description?.substring(0, 50)}...` : "Flores benefits illustration"}
          className="w-full h-full object-contain object-bottom-right"
          loading="lazy"
        />
      </div>

      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer"
            style={{
              backgroundColor: i === currentSlide ? textColor : `${textColor}66`,
            }}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === currentSlide ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  )
}
