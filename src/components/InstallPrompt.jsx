import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only show on mobile
    const isMobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const alreadyDismissed = localStorage.getItem("unsent_install_dismissed");
    if (alreadyDismissed) return;

    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // iOS detection
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isSafari =
      /safari/.test(navigator.userAgent.toLowerCase()) &&
      !/chrome/.test(navigator.userAgent.toLowerCase());

    if (ios && isSafari) {
      setIsIOS(true);
      setTimeout(() => setVisible(true), 3000);
      return;
    }

    // Android / Chrome — listen for beforeinstallprompt
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
      if (outcome === "accepted") {
        setVisible(false);
      }
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Jost:wght@200;300&display=swap');

        .install-prompt {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #131210;
          border-top: 1px solid #2a2720;
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
          font-family: 'Jost', sans-serif;
          font-size: 0.82rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: #e0d5be;
        }

        .install-prompt-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.9rem;
          color: #c4b99a;
          letter-spacing: 0.04em;
          line-height: 1.5;
        }

        .install-prompt-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        .install-btn {
          background: transparent;
          border: 1px solid #6b5d48;
          color: #e0d5be;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 0.55rem 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .install-btn:hover {
          border-color: #c4a97d;
          color: #e8dfc8;
        }

        .install-dismiss {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b5d48;
          padding: 0;
          transition: color 0.3s ease;
          white-space: nowrap;
        }

        .install-dismiss:hover { color: #c4b99a; }

        .install-ios-steps {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 200;
          letter-spacing: 0.12em;
          color: #9a8e7e;
          line-height: 1.8;
          margin-top: 0.3rem;
        }
      `}</style>

      <div className="install-prompt">
        <div className="install-prompt-left">
          <span className="install-prompt-title">
            add unsent to your home screen
          </span>
          {isIOS ? (
            <span className="install-ios-steps">
              tap <strong style={{ color: "#c4a97d" }}>share</strong> →{" "}
              <strong style={{ color: "#c4a97d" }}>add to home screen</strong>
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
