import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLang } from "../lib/LangContext";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLang();
  const lines = t.rotating;
  const [currentLine, setCurrentLine] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setCurrentLine((prev) => (prev + 1) % lines.length);
        setOpacity(1);
      }, 2500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .home-root {
          min-height: 100vh;
          background-color: #111214;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Inter', sans-serif;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .home-inner {
          position: relative;
          z-index: 1;
          animation: fadeUp 1.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .home-title {
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: clamp(2.8rem, 10vw, 5.5rem);
          color: #c8cdd6;
          letter-spacing: 0.06em;
          line-height: 1;
        }

        .home-divider {
          width: 1px;
          height: 28px;
          background: #1e2026;
          margin: 1.2rem auto;
        }

        .home-rotating-line {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(0.9rem, 3vw, 1.05rem);
          color: #4a4f5a;
          letter-spacing: 0.04em;
          line-height: 1.7;
          height: 2.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 480px;
          margin: 0 auto;
          transition: opacity 2.5s ease;
        }

        .home-manifesto {
          margin-top: 2rem;
          max-width: 360px;
          margin-left: auto;
          margin-right: auto;
        }

        .home-manifesto p {
          font-family: 'Inter', sans-serif;
          font-size: 0.62rem;
          font-weight: 300;
          letter-spacing: 0.18em;
          text-transform: lowercase;
          color: #2a2d34;
          line-height: 2.2;
        }

        .home-cta {
          margin-top: 2.8rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.8rem;
          animation: fadeUp 1.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.3s;
          position: relative;
          z-index: 1;
        }

        .home-btn-primary {
          background: transparent;
          border: 1px solid #1e2026;
          color: #4a4f5a;
          font-family: 'Inter', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: lowercase;
          padding: 0.9rem 3rem;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .home-btn-primary:hover {
          border-color: #2e3138;
          color: #6b7080;
        }

        .home-btn-secondary {
          background: none;
          border: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          color: #222428;
          cursor: pointer;
          padding: 0;
          transition: color 0.3s ease;
          position: relative;
        }

        .home-btn-secondary::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0%;
          height: 1px;
          background: #2e3138;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .home-btn-secondary:hover { color: #3a3d44; }
        .home-btn-secondary:hover::after { width: 100%; }

        .home-footer {
          margin-top: 4rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.58rem;
          font-weight: 200;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          color: #1e2026;
          padding-bottom: 2rem;
        }
      `}</style>

      <div className="home-root">
        <div className="home-inner">
          <h1 className="home-title">unsent</h1>
          <div className="home-divider" />

          <p className="home-rotating-line" style={{ opacity }}>
            {lines[currentLine]}
          </p>

          <div className="home-manifesto">
            <p>
              {t.manifesto_1}
              <br />
              {t.manifesto_2}
              <br />
              {t.manifesto_3}
            </p>
          </div>
        </div>

        <div className="home-cta">
          <button
            className="home-btn-primary"
            onClick={() => navigate("/signup")}
          >
            {t.begin}
          </button>
          <button
            className="home-btn-secondary"
            onClick={() => navigate("/login")}
          >
            {t.have_account}
          </button>
        </div>

        <p className="home-footer">
          a quiet app for the messages you'll never send
        </p>
      </div>
    </>
  );
}
