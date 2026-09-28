"use client"

import type { ReactNode } from "react"
import { SITE_DISPLAY_NAME } from "@/lib/site-url"

type AdpOtpShellProps = {
  children: ReactNode
}

export function AdpOtpShell({ children }: AdpOtpShellProps) {
  return (
    <>
      <div className="otp-page">
        <header className="otp-page-header">
          <img
            src="/adp-logo.png"
            alt={SITE_DISPLAY_NAME}
            className="otp-page-logo"
          />
        </header>

        <main className="otp-main">
          <div className="otp-card">
            <div className="otp-lock" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 10V8a5 5 0 0 1 10 0v2"
                  stroke="#8a8a8a"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="11"
                  rx="2"
                  stroke="#8a8a8a"
                  strokeWidth="1.6"
                />
                <circle cx="12" cy="15" r="1.2" fill="#8a8a8a" />
              </svg>
            </div>
            {children}
          </div>
        </main>

        <footer className="otp-footer">
          <div className="otp-footer-copy">
            Copyright © 2000-2026 ADP, Inc. All rights reserved.
          </div>
        </footer>

        <div className="otp-corner" aria-hidden="true">
          <div className="otp-corner-navy" />
          <div className="otp-corner-red" />
        </div>
      </div>

      <style jsx global>{`
        .otp-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f3f3f3;
          position: relative;
          overflow: hidden;
          font-family:
            "Segoe UI",
            -apple-system,
            BlinkMacSystemFont,
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
          color: #333;
        }

        .otp-page-header {
          padding: 20px 28px 0;
          position: relative;
          z-index: 2;
        }

        .otp-page-logo {
          display: block;
          width: auto;
          height: 28px;
        }

        .otp-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px 48px;
          position: relative;
          z-index: 2;
        }

        .otp-card {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border-radius: 2px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
          padding: 28px 36px 32px;
        }

        .otp-lock {
          margin-bottom: 18px;
          line-height: 0;
        }

        .otp-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 16px 28px 20px;
          font-size: 12px;
          color: #555;
          position: relative;
          z-index: 2;
        }

        .otp-footer-copy {
          white-space: nowrap;
        }

        .otp-corner {
          position: absolute;
          right: 0;
          bottom: 0;
          width: min(42vw, 420px);
          height: min(28vw, 220px);
          pointer-events: none;
          z-index: 1;
        }

        .otp-corner-navy {
          position: absolute;
          inset: 0;
          background: #001a4d;
          clip-path: polygon(28% 0, 100% 0, 100% 100%, 0 100%);
        }

        .otp-corner-navy::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            -38deg,
            transparent 0 28px,
            rgba(255, 255, 255, 0.08) 28px 30px
          );
        }

        .otp-corner-red {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 5px;
          background: #d0271d;
        }

        @media (max-width: 720px) {
          .otp-footer {
            justify-content: flex-start;
          }

          .otp-footer-copy {
            white-space: normal;
          }

          .otp-card {
            padding: 24px 22px 28px;
          }

          .otp-corner {
            width: 55vw;
            height: 140px;
          }
        }
      `}</style>
    </>
  )
}
