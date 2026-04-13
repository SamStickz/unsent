import { useEffect, useState, useRef } from "react";

const QUOTE = `"Oh, and there's a woman. Yeah.\nA woman I love. And I got close.\nI nearly got fucking everything."`;
const TYPING_SPEED = 38; // ms per character
const PAUSE_AFTER = 2200; // ms pause after typing finishes
const FADE_DURATION = 900; // ms

export default function SplashScreen({ onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const indexRef = useRef(0);
  const audioRef = useRef(null);

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  // Typewriter
  useEffect(() => {
    const type = () => {
      if (indexRef.current < QUOTE.length) {
        setDisplayed(QUOTE.slice(0, indexRef.current + 1));
        indexRef.current++;
        setTimeout(type, TYPING_SPEED);
      } else {
        // Done typing — pause then fade out
        setTimeout(() => {
          setFading(true);
          setTimeout(onDone, FADE_DURATION);
        }, PAUSE_AFTER);
      }
    };
    const start = setTimeout(type, 600);
    return () => clearTimeout(start);
  }, []);

  // Render lines split on \n
  const lines = displayed.split("\n");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;1,400&display=swap');

        .shelby-splash {
          position: fixed;
          inset: 0;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          z-index: 9999;
          padding: 2rem 2.4rem;
          transition: opacity ${FADE_DURATION}ms ease;
        }

        .shelby-splash.fading { opacity: 0; }

        .shelby-lines {
          max-width: 520px;
        }

        .shelby-line {
          display: block;
          font-family: 'Courier Prime', 'Courier New', monospace;
          font-size: clamp(0.88rem, 3.5vw, 1.05rem);
          font-weight: 400;
          color: #c4a060;
          letter-spacing: 0.04em;
          line-height: 1.9;
          white-space: pre-wrap;
          text-shadow: 0 0 8px rgba(196, 160, 96, 0.4);
        }

        .shelby-cursor {
          display: inline-block;
          width: 0.55em;
          height: 1.1em;
          background: #c4a060;
          margin-left: 2px;
          vertical-align: text-bottom;
          box-shadow: 0 0 6px rgba(196, 160, 96, 0.6);
          transition: opacity 0.1s;
        }

        .shelby-cursor.hidden { opacity: 0; }

        .shelby-attribution {
          margin-top: 2rem;
          font-family: 'Courier Prime', monospace;
          font-size: 0.62rem;
          color: #4a3e2a;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        /* Subtle scanline overlay */
        .shelby-splash::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.08) 2px,
            rgba(0,0,0,0.08) 4px
          );
          pointer-events: none;
        }
      `}</style>

      <div className={`shelby-splash ${fading ? "fading" : ""}`}>
        <div className="shelby-lines">
          {lines.map((line, i) => (
            <span key={i} className="shelby-line">
              {line}
              {i === lines.length - 1 && (
                <span
                  className={`shelby-cursor ${cursorVisible ? "" : "hidden"}`}
                />
              )}
            </span>
          ))}
        </div>
        {displayed.length === QUOTE.length && (
          <p className="shelby-attribution">— Thomas Shelby</p>
        )}
      </div>
    </>
  );
}
