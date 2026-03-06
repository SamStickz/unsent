import { useState } from "react";

const slides = [
  {
    title: "not a diary.",
    body: "a diary records your days.\nthis is for the words that have no place else to go.",
  },
  {
    title: "not a therapist.",
    body: "no responses. no advice.\njust somewhere quiet to say what you couldn't send.",
  },
  {
    title: "yours alone.",
    body: "no feeds. no sharing. no one reads this.\nwhat you write here stays here.",
  },
  {
    title: "whenever you're ready.",
    body: "write to someone you've lost.\nto a version of yourself. to no one in particular.\nthere are no rules.",
  },
];

export default function Onboarding({ onDone }) {
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setExiting(true);
      setTimeout(() => {
        setCurrent((prev) => prev + 1);
        setExiting(false);
      }, 400);
    } else {
      // Mark onboarding done in localStorage
      localStorage.setItem("unsent_onboarded", "true");
      onDone();
    }
  };

  const slide = slides[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        .ob-overlay {
          position: fixed;
          inset: 0;
          background: #0e0d0b;
          background-image: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(180,155,110,0.07) 0%, transparent 70%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 2rem;
          font-family: 'Jost', sans-serif;
        }

        .ob-inner {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: obFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ob-inner.exiting {
          animation: obFadeOut 0.4s ease both;
        }

        @keyframes obFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes obFadeOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-12px); }
        }

        .ob-step {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 200;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #3a352d;
          margin-bottom: 2.4rem;
        }

        .ob-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(2rem, 8vw, 3rem);
          color: #e8dfc8;
          letter-spacing: 0.08em;
          line-height: 1.1;
          margin-bottom: 1.6rem;
        }

        .ob-divider {
          width: 24px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #3a352d, transparent);
          margin-bottom: 1.6rem;
        }

        .ob-body {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.05rem;
          color: #7a6f5e;
          line-height: 1.85;
          letter-spacing: 0.04em;
          white-space: pre-line;
          margin-bottom: 3.2rem;
        }

        .ob-next {
          background: transparent;
          border: 1px solid #2e2b26;
          color: #c4a97d;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 0.85rem 2.4rem;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .ob-next::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(196,169,125,0.07);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ob-next:hover { border-color: #c4a97d; color: #e8dfc8; }
        .ob-next:hover::before { transform: scaleX(1); }

        .ob-dots {
          display: flex;
          gap: 0.5rem;
          margin-top: 2.4rem;
        }

        .ob-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #2a2720;
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .ob-dot.active {
          background: #c4a97d;
          transform: scale(1.3);
        }

        .ob-skip {
          position: absolute;
          bottom: 2.4rem;
          background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem; font-weight: 200;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #2a2720;
          transition: color 0.3s ease;
        }

        .ob-skip:hover { color: #6b5d48; }
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
            {current < slides.length - 1 ? "continue" : "begin writing"}
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
