import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onDone, 800);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@200;300&display=swap');

        .splash {
          position: fixed;
          inset: 0;
          background: #0e0d0b;
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
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 2.8rem;
          color: #e8dfc8;
          letter-spacing: 0.22em;
          text-transform: lowercase;
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
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #6b5d48;
          animation: splashPulse 1.2s ease-in-out infinite;
        }

        .splash-dot:nth-child(2) { animation-delay: 0.2s; }
        .splash-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes splashPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); background: #c4a97d; }
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
