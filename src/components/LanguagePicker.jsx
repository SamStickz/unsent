// LanguagePicker.jsx
import { useLang } from "../lib/LangContext";
import { LANGUAGES } from "../lib/lang";

export default function LanguagePicker() {
  const { chooseLang } = useLang();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');
        .lang-root { min-height: 100vh; background-color: #111214; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; padding: 2rem; animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .lang-brand { font-family: 'IM Fell English', serif; font-weight: 400; font-size: 2.2rem; color: #6a6f7a; letter-spacing: 0.1em; margin-bottom: 0.6rem; }
        .lang-divider { width: 1px; height: 32px; background: linear-gradient(180deg, transparent, #3a3d44, transparent); margin: 0 auto 2.4rem; }
        .lang-prompt { font-family: 'Inter', sans-serif; font-size: 0.56rem; font-weight: 200; letter-spacing: 0.28em; text-transform: lowercase; color: #4a4f5a; margin-bottom: 2.4rem; text-align: center; }
        .lang-options { display: flex; flex-direction: column; gap: 0.8rem; width: 100%; max-width: 260px; }
        .lang-btn { background: transparent; border: none; border-bottom: 1px solid #2a2d34; padding: 0.8rem 0; display: flex; align-items: baseline; justify-content: space-between; cursor: pointer; position: relative; overflow: hidden; }
        .lang-btn::after { content: ''; position: absolute; bottom: 0; left: 0; height: 1px; width: 0%; background: #6a6f7a; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .lang-btn:hover::after { width: 100%; }
        .lang-btn-native { font-family: 'IM Fell English', serif; font-style: italic; font-weight: 400; font-size: 1.15rem; color: #6a6f7a; letter-spacing: 0.06em; transition: color 0.3s ease; }
        .lang-btn-label { font-family: 'Inter', sans-serif; font-size: 0.54rem; font-weight: 200; letter-spacing: 0.2em; text-transform: lowercase; color: #4a4f5a; transition: color 0.3s ease; }
        .lang-btn:hover .lang-btn-native { color: #b0b5c0; }
        .lang-btn:hover .lang-btn-label { color: #6a6f7a; }
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
