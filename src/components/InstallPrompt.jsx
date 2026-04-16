import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isMobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const alreadyDismissed = localStorage.getItem("unsent_install_dismissed");
    if (alreadyDismissed) return;

    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isSafari =
      /safari/.test(navigator.userAgent.toLowerCase()) &&
      !/chrome/.test(navigator.userAgent.toLowerCase());

    if (ios && isSafari) {
      setIsIOS(true);
      setTimeout(() => setVisible(true), 3000);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem("unsent_install_dismissed", "true");
  };

  if (!visible || dismissed) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300&display=swap');

        .install-prompt {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #111214;
          border-top: 1px solid #1c1e22;
          padding: 1.2rem 1.6rem 2rem;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .install-prompt-left {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          flex: 1;
        }

        .install-prompt-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.18em;
          text-transform: lowercase;
          color: #2e3138;
        }

        .install-prompt-sub {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.85rem;
          color: #2a2d34;
          letter-spacing: 0.04em;
          line-height: 1.5;
        }

        .install-ios-steps {
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem;
          font-weight: 200;
          letter-spacing: 0.14em;
          color: #2a2d34;
          line-height: 1.8;
          margin-top: 0.2rem;
        }

        .install-ios-steps strong {
          color: #3a3d44;
          font-weight: 300;
        }

        .install-prompt-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        .install-btn {
          background: transparent;
          border: 1px solid #1c1e22;
          color: #2e3138;
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: lowercase;
          padding: 0.55rem 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .install-btn:hover { border-color: #2e3138; color: #6b7080; }

        .install-dismiss {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.52rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: lowercase;
          color: #1e2026;
          padding: 0;
          transition: color 0.3s ease;
          white-space: nowrap;
        }

        .install-dismiss:hover { color: #3a3d44; }
      `}</style>

      <div className="install-prompt">
        <div className="install-prompt-left">
          <span className="install-prompt-title">
            add unsent to your home screen
          </span>
          {isIOS ? (
            <span className="install-ios-steps">
              tap <strong>share</strong> → <strong>add to home screen</strong>
            </span>
          ) : (
            <span className="install-prompt-sub">for the full experience</span>
          )}
        </div>

        <div className="install-prompt-actions">
          {!isIOS && (
            <button className="install-btn" onClick={handleInstall}>
              install
            </button>
          )}
          <button className="install-dismiss" onClick={handleDismiss}>
            not now
          </button>
        </div>
      </div>
    </>
  );
}
