import { useEffect, useState, useRef } from "react";

const QUOTE = `Oh, and there's a woman. Yeah.\nA woman, who I love. And I got close.\nI nearly got fucking everything!`;
const ATTRIBUTION = "— Thomas Shelby";

export default function ShelbySplash({ onDone }) {
  const [started, setStarted] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [showAttr, setShowAttr] = useState(false);
  const [fading, setFading] = useState(false);
  const iRef = useRef(0);

  const skip = () => {
    setFading(true);
    setTimeout(() => onDone(), 800);
  };

  useEffect(() => {
    if (!started) return;

    const audio = new Audio("/shelby.m4a");
    audio.volume = 1;
    audio.play();

    let cancelled = false;
    const startDelay = setTimeout(() => {
      function type() {
        if (cancelled) return;
        if (iRef.current < QUOTE.length) {
          iRef.current++;
          setDisplayed(QUOTE.slice(0, iRef.current));
          setTimeout(type, 265);
        } else {
          setTimeout(() => {
            if (!cancelled) setShowAttr(true);
          }, 400);
          setTimeout(() => {
            if (!cancelled) setFading(true);
          }, 1200);
          setTimeout(() => {
            if (!cancelled) onDone();
          }, 2000);
        }
      }
      type();
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(startDelay);
      audio.pause();
    };
  }, [started, onDone]);

  if (!started) {
    return (
      <>
        <style>{`
          .shelby-splash {
            position: fixed;
            inset: 0;
            background: #111214;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2.5rem;
            z-index: 9999;
            cursor: pointer;
            gap: 2rem;
          }
          .shelby-enter {
            font-family: 'Courier New', Courier, monospace;
            font-size: 13px;
            color: #8a8f9a;
            letter-spacing: 0.2em;
            animation: shelbyCursorBlink 1.2s step-end infinite;
          }
          .shelby-skip-pre {
            background: none;
            border: none;
            cursor: pointer;
            font-family: 'Courier New', Courier, monospace;
            font-size: 11px;
            color: #3a3d44;
            letter-spacing: 0.18em;
            text-transform: lowercase;
            padding: 0;
            transition: color 0.3s ease;
          }
          .shelby-skip-pre:hover { color: #6a6f7a; }
          @keyframes shelbyCursorBlink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0; }
          }
        `}</style>
        <div className="shelby-splash" onClick={() => setStarted(true)}>
          <div className="shelby-enter">click to enter</div>
          <button
            className="shelby-skip-pre"
            onClick={(e) => {
              e.stopPropagation();
              onDone();
            }}
          >
            skip intro
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .shelby-splash {
          position: fixed;
          inset: 0;
          background: #111214;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          z-index: 9999;
          opacity: 1;
          transition: opacity 0.8s ease;
          gap: 0;
        }
        .shelby-splash.fading { opacity: 0; }

        .shelby-content { flex: 1; display: flex; align-items: center; justify-content: center; }

        .shelby-quote {
          font-family: 'Courier New', Courier, monospace;
          font-size: clamp(14px, 2.2vw, 18px);
          color: #8a8f9a;
          line-height: 1.9;
          white-space: pre-wrap;
          max-width: 520px;
          letter-spacing: 0.02em;
        }

        .shelby-cursor {
          display: inline-block;
          width: 10px;
          height: 1em;
          background: #6a6f7a;
          vertical-align: text-bottom;
          margin-left: 2px;
          animation: shelbyCursorBlink 0.53s step-end infinite;
        }

        @keyframes shelbyCursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        .shelby-attr {
          font-family: 'Courier New', Courier, monospace;
          font-size: 12px;
          color: #5a5f6a;
          margin-top: 1.6rem;
          letter-spacing: 0.12em;
          opacity: 0;
          transition: opacity 0.9s ease;
        }
        .shelby-attr.show { opacity: 1; }

        .shelby-skip {
          position: fixed;
          bottom: 2.5rem;
          right: 2.5rem;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Courier New', Courier, monospace;
          font-size: 11px;
          color: #3a3d44;
          letter-spacing: 0.18em;
          text-transform: lowercase;
          padding: 0;
          transition: color 0.3s ease;
          z-index: 10000;
        }
        .shelby-skip:hover { color: #6a6f7a; }
      `}</style>

      <div className={`shelby-splash${fading ? " fading" : ""}`}>
        <div className="shelby-content">
          <div>
            <div className="shelby-quote">
              {displayed}
              {!fading && <span className="shelby-cursor" />}
            </div>
            <div className={`shelby-attr${showAttr ? " show" : ""}`}>
              {ATTRIBUTION}
            </div>
          </div>
        </div>
        <button className="shelby-skip" onClick={skip}>
          skip
        </button>
      </div>
    </>
  );
}
