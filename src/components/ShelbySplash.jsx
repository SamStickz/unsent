import { useEffect, useState, useRef } from "react";

const QUOTE = `Oh, and there's a woman. Yeah.\nA woman, who I love. And I got close.\nI nearly got fucking everything!`;
const ATTRIBUTION = "— Thomas Shelby";

export default function ShelbySplash({ onDone }) {
  const [started, setStarted] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [showAttr, setShowAttr] = useState(false);
  const [fading, setFading] = useState(false);
  const iRef = useRef(0);

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
            background: #0e0d0b;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2.5rem;
            z-index: 9999;
            cursor: pointer;
          }
          .shelby-enter {
            font-family: 'Courier New', Courier, monospace;
            font-size: 13px;
            color: #7A6030;
            letter-spacing: 0.2em;
            animation: shelbyCursorBlink 1.2s step-end infinite;
          }
          @keyframes shelbyCursorBlink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0; }
          }
        `}</style>
        <div className="shelby-splash" onClick={() => setStarted(true)}>
          <div className="shelby-enter">click to enter</div>
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
          background: #0e0d0b;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          z-index: 9999;
          opacity: 1;
          transition: opacity 0.8s ease;
        }
        .shelby-splash.fading { opacity: 0; }

        .shelby-quote {
          font-family: 'Courier New', Courier, monospace;
          font-size: clamp(15px, 2.2vw, 19px);
          color: #D4A84B;
          line-height: 1.9;
          white-space: pre-wrap;
          max-width: 520px;
          letter-spacing: 0.02em;
        }

        .shelby-cursor {
          display: inline-block;
          width: 11px;
          height: 1em;
          background: #D4A84B;
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
          font-size: 13px;
          color: #7A6030;
          margin-top: 1.6rem;
          letter-spacing: 0.12em;
          opacity: 0;
          transition: opacity 0.9s ease;
        }
        .shelby-attr.show { opacity: 1; }
      `}</style>

      <div className={`shelby-splash${fading ? " fading" : ""}`}>
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
    </>
  );
}
