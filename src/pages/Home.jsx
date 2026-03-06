import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const lines = [
  "for the person you can't call anymore.",
  "for the apology that came too late.",
  "for the love you never said out loud.",
  "for the argument you're still having in your head.",
  "for the goodbye you never got to give.",
  "for the version of you that needed to hear this.",
];

export default function Home() {
  const navigate = useNavigate();
  const [currentLine, setCurrentLine] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out slowly
      setOpacity(0);
      setTimeout(() => {
        // Switch line while invisible
        setCurrentLine((prev) => (prev + 1) % lines.length);
        // Fade back in slowly
        setOpacity(1);
      }, 2500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .home-root {
          min-height: 100vh;
          background-color: #0e0d0b;
          background-image:
            radial-gradient(ellipse 100% 60% at 50% 0%, rgba(180,155,110,0.08) 0%, transparent 65%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Jost', sans-serif;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        /* Ambient glow */
        .home-root::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(196,169,125,0.04) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
          pointer-events: none;
        }

        .home-inner {
          position: relative;
          z-index: 1;
          animation: fadeUp 1.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .home-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(3.5rem, 12vw, 6.5rem);
          color: #e8dfc8;
          letter-spacing: 0.22em;
          text-transform: lowercase;
          line-height: 1;
        }

        .home-divider {
          width: 1px;
          height: 48px;
          background: linear-gradient(180deg, transparent, #3a352d, transparent);
          margin: 2rem auto;
        }

        /* Rotating lines */
        .home-rotating-line {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(1rem, 3.5vw, 1.3rem);
          color: #a89880;
          letter-spacing: 0.06em;
          line-height: 1.7;
          min-height: 2.6rem;
          max-width: 480px;
          margin: 0 auto;
          transition: opacity 2.5s ease;
        }

        /* Manifesto */
        .home-manifesto {
          margin-top: 3.5rem;
          max-width: 360px;
          margin-left: auto;
          margin-right: auto;
        }

        .home-manifesto p {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #7a6f5e;
          line-height: 2;
        }
        /* CTA */
        .home-cta {
          margin-top: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          animation: fadeUp 1.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.3s;
          position: relative;
          z-index: 1;
        }

        .home-btn-primary {
          background: transparent;
          border: 1px solid #3a352d;
          color: #c4a97d;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          padding: 1rem 3.5rem;
          cursor: pointer;
          transition: all 0.5s ease;
          position: relative;
          overflow: hidden;
        }

        .home-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(196, 169, 125, 0.06);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .home-btn-primary:hover {
          border-color: #c4a97d;
          color: #e8dfc8;
          letter-spacing: 0.4em;
        }

        .home-btn-primary:hover::before {
          transform: scaleX(1);
        }

        .home-btn-secondary {
          background: none;
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b5d48;
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
          background: #4a4439;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .home-btn-secondary:hover {
          color: #7a6f5e;
        }

        .home-btn-secondary:hover::after {
          width: 100%;
        }

        /* Footer */
        .home-footer {
          position: fixed;
          bottom: 2rem;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 0.62rem;
          font-weight: 200;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6b5d48;
          z-index: 1;
        }

        .home-footer span {
          margin: 0 0.6rem;
          color: #6b5d48;
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
              not a diary &nbsp;·&nbsp; not a therapist
              <br />
              just somewhere to put the words
              <br />
              that have nowhere else to go
            </p>
          </div>
        </div>

        <div className="home-cta">
          <button
            className="home-btn-primary"
            onClick={() => navigate("/signup")}
          >
            Begin
          </button>
          <button
            className="home-btn-secondary"
            onClick={() => navigate("/login")}
          >
            I have an account
          </button>
        </div>

        <p className="home-footer">
          a quiet app for the messages you'll never send
        </p>
      </div>
    </>
  );
}
