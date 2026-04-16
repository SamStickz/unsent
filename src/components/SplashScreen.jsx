import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onDone, 800);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300&display=swap');

        .splash {
          position: fixed;
          inset: 0;
          background: #111214;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          gap: 2rem;
          transition: opacity 0.8s ease;
        }

        .splash.fading { opacity: 0; }

        .splash-brand {
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: 2.6rem;
          color: #2e3138;
          letter-spacing: 0.12em;
          animation: splashFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .splash-dots {
          display: flex;
          gap: 0.5rem;
          animation: splashFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.2s;
        }

        .splash-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #1e2026;
          animation: splashPulse 1.4s ease-in-out infinite;
        }

        .splash-dot:nth-child(2) { animation-delay: 0.2s; }
        .splash-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes splashPulse {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50%       { opacity: 0.5;  transform: scale(1.2); background: #3a3d44; }
        }
      `}</style>

      <div className={`splash ${fading ? "fading" : ""}`}>
        <span className="splash-brand">unsent</span>
        <div className="splash-dots">
          <div className="splash-dot" />
          <div className="splash-dot" />
          <div className="splash-dot" />
        </div>
      </div>
    </>
  );
}
