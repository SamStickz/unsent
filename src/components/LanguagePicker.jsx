import { useLang } from "../lib/LangContext";
import { LANGUAGES } from "../lib/lang";

export default function LanguagePicker() {
  const { chooseLang } = useLang();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Jost:wght@200;300&display=swap');

        .lang-root {
          min-height: 100vh;
          background-color: #0e0d0b;
          background-image:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(180,155,110,0.07) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Jost', sans-serif;
          padding: 2rem;
          animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lang-brand {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 2.2rem;
          color: #e8dfc8;
          letter-spacing: 0.22em;
          text-transform: lowercase;
          margin-bottom: 0.6rem;
        }

        .lang-divider {
          width: 1px;
          height: 32px;
          background: linear-gradient(180deg, transparent, #2e2b26, transparent);
          margin: 0 auto 2.4rem;
        }

        .lang-prompt {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 200;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #4a4030;
          margin-bottom: 2.4rem;
          text-align: center;
        }

        .lang-options {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          width: 100%;
          max-width: 260px;
        }

        .lang-btn {
          background: transparent;
          border: none;
          border-bottom: 1px solid #1a1814;
          padding: 0.8rem 0;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          cursor: pointer;
          transition: border-color 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .lang-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          height: 1px; width: 0%;
          background: #c4a97d;
          transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .lang-btn:hover::after { width: 100%; }

        .lang-btn-native {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.2rem;
          color: #c4b99a;
          letter-spacing: 0.06em;
          transition: color 0.3s ease;
        }

        .lang-btn-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.56rem;
          font-weight: 200;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #3a352d;
          transition: color 0.3s ease;
        }

        .lang-btn:hover .lang-btn-native { color: #e8dfc8; }
        .lang-btn:hover .lang-btn-label { color: #8a7a68; }
      `}</style>

      <div className="lang-root">
        <div className="lang-brand">unsent</div>
        <div className="lang-divider" />
        <p className="lang-prompt">choose your language</p>
        <div className="lang-options">
          {Object.entries(LANGUAGES).map(([code, { label, native }]) => (
            <button
              key={code}
              className="lang-btn"
              onClick={() => chooseLang(code)}
            >
              <span className="lang-btn-native">{native}</span>
              <span className="lang-btn-label">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
