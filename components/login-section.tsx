"use client";

import { useState } from "react";
import { Phone, Facebook, Linkedin } from "lucide-react";
import { FloresLogo } from "./flores-logo";
import { ParticipantLoginForm } from "./participant-login-form";
import { EmployerLoginForm } from "./employer-login-form";
import { MobileCarousel } from "./mobile-carousel";

export function LoginSection() {
  const [activeSection, setActiveSection] = useState<
    "none" | "participant" | "employer"
  >("participant");

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div
        className="h-2 lg:hidden"
        style={{
          background:
            "linear-gradient(90deg, #0099D8 0%, #003D6B 50%, #F7931E 100%)",
        }}
      />

      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-6 sm:py-8 lg:py-12 overflow-y-auto pb-6 sm:pb-8 lg:pb-12">
        <FloresLogo className="mb-6 sm:mb-8" />

        <div className="w-full max-w-md space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <button
              onClick={async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setActiveSection(
                  activeSection === "participant" ? "none" : "participant",
                );
              }}
              className="transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:opacity-90 text-sm sm:text-base lg:text-lg h-12 sm:h-14 lg:h-[55px]"
              style={{
                background:
                  "linear-gradient(to right, rgb(0, 85, 141) 0%, rgb(50, 153, 205) 51%, rgb(50, 153, 205) 100%)",
                backgroundSize: "200%",
                borderRadius: "50px",
                boxShadow:
                  "rgba(0, 0, 0, 0.12) 0px 1px 3px 0px, rgba(0, 0, 0, 0.24) 0px 1px 2px 0px",
                color: "rgb(255, 255, 255)",
                fontFamily: "Lato, sans-serif",
                fontWeight: 700,
                letterSpacing: "2px",
                padding: "14px 20px",
                textTransform: "uppercase",
                width: "100%",
                maxWidth: "423.656px",
              }}
            >
              PARTICIPANT LOGIN
            </button>
          </div>
          {activeSection === "participant" && <ParticipantLoginForm />}

          <div className="flex justify-center">
            <button
              onClick={async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setActiveSection(
                  activeSection === "employer" ? "none" : "employer",
                );
              }}
              className="transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:opacity-90 text-sm sm:text-base lg:text-lg h-12 sm:h-14 lg:h-[55px]"
              style={{
                backgroundColor: "rgb(0, 85, 141)",
                backgroundImage:
                  "linear-gradient(to left, rgb(50, 153, 205) 0%, rgb(0, 85, 141) 51%, rgb(50, 153, 205) 100%)",
                backgroundSize: "200%",
                borderRadius: "50px",
                boxShadow:
                  "rgba(0, 0, 0, 0.12) 0px 1px 3px 0px, rgba(0, 0, 0, 0.24) 0px 1px 2px 0px",
                color: "rgb(255, 255, 255)",
                fontFamily: "Lato, sans-serif",
                fontWeight: 700,
                letterSpacing: "2px",
                padding: "14px 20px",
                textTransform: "uppercase",
                width: "100%",
                maxWidth: "423.656px",
              }}
            >
              EMPLOYER LOGIN
            </button>
          </div>
          {activeSection === "employer" && <EmployerLoginForm />}

          <a
            href="/register"
            className="block w-full py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg tracking-wide border-2 transition-all hover:bg-blue-50 text-center mb-2"
            style={{ borderColor: "#2e6da4", color: "#2e6da4" }}
          >
            REGISTER
          </a>
          <a
            href="https://www.flores-associates.com/resources.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg tracking-wide border-2 transition-all hover:bg-gray-50 text-center"
            style={{ borderColor: "#003D6B", color: "#003D6B" }}
          >
            RESOURCE LIBRARY
          </a>
        </div>

        <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
          <a
            href="https://www.flores247.com/contact-login.vbhtml"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Contact Flores"
            title="Contact Flores"
          >
            <Phone className="w-5 h-5" />
          </a>
          <a
            href="https://www.facebook.com/FloresAssociates"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/company/flores-associates/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="lg:hidden mt-6 sm:mt-8 px-4 sm:px-6 pb-6 sm:pb-8">
        <MobileCarousel />
      </div>
    </div>
  );
}
