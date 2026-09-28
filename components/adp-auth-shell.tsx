"use client"

import type { ReactNode } from "react"
import adpLogo from "../adp_login/Screenshot 2026-07-06 122158.png"
import { SITE_DISPLAY_NAME } from "@/lib/site-url"

interface AdpAuthShellProps {
  children: ReactNode
  title?: string
  subtitle?: string
  step?: number
  totalSteps?: number
  showHeaderActions?: boolean
  showFooterExtras?: boolean
}

export function AdpAuthShell({
  children,
  title,
  subtitle,
  step,
  totalSteps = 3,
  showHeaderActions = true,
  showFooterExtras = false,
}: AdpAuthShellProps) {
  const steps = [
    { label: "Sign in", number: 1 },
    { label: "Verify", number: 2 },
    { label: "Complete", number: 3 },
  ]

  return (
    <>
      <div className="page-shell">
        <div className="main-wrapper">
          <div className="login-card">
            {showHeaderActions && (
              <div className="card-header-actions">
                <span className="lock-icon" aria-hidden>
                  🔒
                </span>
                <a href="#" className="lang-select">
                  Languages ▾
                </a>
              </div>
            )}

            <div className="logo-container">
              <img src={adpLogo.src} alt={SITE_DISPLAY_NAME} className="logo-img" />
            </div>

            {typeof step === "number" ? (
              <nav className="step-progress" aria-label="Sign-in progress">
                {steps.map((item, index) => {
                  const isComplete = step > item.number
                  const isCurrent = step === item.number
                  return (
                    <div key={item.label} className="step-progress-item">
                      <div
                        className={`step-dot ${isComplete ? "step-dot-complete" : ""} ${isCurrent ? "step-dot-current" : ""}`}
                      >
                        {isComplete ? "✓" : item.number}
                      </div>
                      <span className={`step-label ${isCurrent ? "step-label-current" : ""}`}>
                        {item.label}
                      </span>
                      {index < steps.length - 1 ? <div className="step-line" /> : null}
                    </div>
                  )
                })}
              </nav>
            ) : null}

            {title ? <h1>{title}</h1> : null}
            {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}

            {children}

            {showFooterExtras ? (
              <>
                <div className="new-user-section">
                  <span>
                    New user? <a href="#">Get started</a>
                  </span>
                </div>

                <div className="mobile-app-section">
                  <div className="mobile-text">
                    <h3>Download the ADP mobile app</h3>
                    <p>
                      Scan the QR code with your device to begin. Secure and convenient tools
                      right in your hands for simple, anytime access across devices.
                    </p>
                    <a href="#" className="learn-more">
                      LEARN MORE →
                    </a>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <footer className="global-footer">
          <div className="footer-links">
            <a href="#">PRIVACY</a>
            <a href="#">LEGAL</a>
            <a href="#">AI Transparency</a>
          </div>
          <div>© 2014-2026 ADP, Inc.</div>
        </footer>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
            sans-serif;
        }

        html,
        body {
          min-height: 100%;
        }

        body {
          background-color: #f4f4f5;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow-x: hidden;
        }

        body::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          width: 300px;
          height: 150px;
          background: linear-gradient(135deg, transparent 50%, #000040 50%);
          z-index: 1;
          pointer-events: none;
        }

        .page-shell {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .main-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 2;
        }

        .login-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 500px;
          padding: 30px 40px;
          position: relative;
        }

        .card-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .lock-icon {
          color: #71717a;
          font-size: 16px;
        }

        .lang-select {
          color: #0046be;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }

        .logo-container {
          text-align: center;
          margin-bottom: 20px;
        }

        .logo-img {
          max-height: 55px;
          width: auto;
          object-fit: contain;
        }

        .step-progress {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 0;
          margin-bottom: 22px;
          padding: 0 4px;
        }

        .step-progress-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
          min-width: 0;
        }

        .step-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #d4d4d8;
          color: #a1a1aa;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          z-index: 1;
        }

        .step-dot-current {
          border-color: #0046be;
          color: #0046be;
          box-shadow: 0 0 0 4px rgba(0, 70, 190, 0.12);
        }

        .step-dot-complete {
          border-color: #0046be;
          background: #0046be;
          color: #fff;
        }

        .step-label {
          margin-top: 6px;
          font-size: 11px;
          color: #a1a1aa;
          text-align: center;
          white-space: nowrap;
        }

        .step-label-current {
          color: #18181b;
          font-weight: 600;
        }

        .step-line {
          position: absolute;
          top: 14px;
          left: calc(50% + 14px);
          width: calc(100% - 28px);
          height: 2px;
          background: #e4e4e7;
        }

        h1 {
          text-align: center;
          font-size: 22px;
          color: #18181b;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .page-subtitle {
          text-align: center;
          font-size: 14px;
          color: #71717a;
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .new-user-section {
          text-align: center;
          padding: 20px 0;
        }

        .new-user-section a {
          color: #0046be;
          text-decoration: underline;
          font-weight: 500;
        }

        .mobile-app-section {
          border-top: 1px solid #e4e4e7;
          padding-top: 20px;
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .mobile-text h3 {
          font-size: 14px;
          color: #18181b;
          margin-bottom: 4px;
        }

        .mobile-text p {
          font-size: 12px;
          color: #71717a;
          line-height: 1.4;
          margin-bottom: 6px;
        }

        .learn-more {
          color: #0046be;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .global-footer {
          background-color: #f4f4f5;
          border-top: 1px solid #e4e4e7;
          padding: 15px 40px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #52525b;
          z-index: 2;
        }

        .footer-links a {
          color: #0046be;
          text-decoration: underline;
          margin-right: 15px;
        }

        @media (max-width: 600px) {
          .login-card {
            padding: 20px;
          }

          .global-footer {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .footer-links a {
            margin: 0 8px;
          }
        }
      `}</style>
    </>
  )
}
