import { useState } from "react";
import { useLang } from "../lib/LangContext";

export default function Onboarding({ onDone }) {
  const [current, setCurrent] = useState(0);
  const { t } = useLang();
  const slides = t.onboarding;
  const [exiting, setExiting] = useState(false);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setExiting(true);
      setTimeout(() => {
        setCurrent((prev) => prev + 1);
        setExiting(false);
      }, 400);
    } else {
      localStorage.setItem("unsent_onboarded", "true");
      onDone();
    }
  };

  const slide = slides[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');

        .ob-overlay { position: fixed; inset: 0; background: #111214; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 200; padding: 2rem; font-family: 'Inter', sans-serif; }
        .ob-inner { width: 100%; max-width: 380px; display: flex; flex-direction: column; align-items: center; text-align: center; animation: obFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .ob-inner.exiting { animation: obFadeOut 0.4s ease both; }
        @keyframes obFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes obFadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-12px); } }
        .ob-step { font-family: 'Inter', sans-serif; font-size: 0.54rem; font-weight: 200; letter-spacing: 0.24em; text-transform: lowercase; color: #4a4f5a; margin-bottom: 2.4rem; }
        .ob-title { font-family: 'IM Fell English', serif; font-weight: 400; font-size: clamp(1.8rem, 8vw, 2.8rem); color: #8a8f9a; letter-spacing: 0.06em; line-height: 1.1; margin-bottom: 1.6rem; }
        .ob-divider { width: 24px; height: 1px; background: linear-gradient(90deg, transparent, #3a3d44, transparent); margin-bottom: 1.6rem; }
        .ob-body { font-family: 'IM Fell English', serif; font-style: italic; font-weight: 400; font-size: 1.1rem; color: #6a6f7a; line-height: 1.9; letter-spacing: 0.04em; white-space: pre-line; margin-bottom: 3.2rem; }
        .ob-next { background: transparent; border: 1px solid #2a2d34; color: #6a6f7a; font-family: 'Inter', sans-serif; font-size: 0.6rem; font-weight: 300; letter-spacing: 0.3em; text-transform: lowercase; padding: 0.85rem 2.4rem; cursor: pointer; transition: all 0.4s ease; }
        .ob-next:hover { border-color: #6a6f7a; color: #c8cdd6; }
        .ob-dots { display: flex; gap: 0.5rem; margin-top: 2.4rem; }
        .ob-dot { width: 3px; height: 3px; border-radius: 50%; background: #2a2d34; transition: background 0.3s ease, transform 0.3s ease; }
        .ob-dot.active { background: #6a6f7a; transform: scale(1.3); }
        .ob-skip { position: absolute; bottom: 2.4rem; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.54rem; font-weight: 200; letter-spacing: 0.2em; text-transform: lowercase; color: #3a3d44; transition: color 0.3s ease; }
        .ob-skip:hover { color: #6a6f7a; }
      `}</style>

      <div className="ob-overlay">
        <div className={`ob-inner ${exiting ? "exiting" : ""}`}>
          <span className="ob-step">
            {current + 1} of {slides.length}
          </span>
          <h2 className="ob-title">{slide.title}</h2>
          <div className="ob-divider" />
          <p className="ob-body">{slide.body}</p>
          <button className="ob-next" onClick={handleNext}>
            {current < slides.length - 1 ? t.continue : t.begin_writing}
          </button>
          <div className="ob-dots">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`ob-dot ${i === current ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
        {current < slides.length - 1 && (
          <button
            className="ob-skip"
            onClick={() => {
              localStorage.setItem("unsent_onboarded", "true");
              onDone();
            }}
          >
            skip
          </button>
        )}
      </div>
    </>
  );
}
