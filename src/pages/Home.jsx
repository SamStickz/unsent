import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .home-root {
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
          text-align: center;
        }

        .home-inner {
          animation: fadeUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .home-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(3.2rem, 10vw, 5.5rem);
          color: #e8dfc8;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          line-height: 1;
        }

        .home-divider {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #6b5d48, transparent);
          margin: 1.8rem auto;
        }

        .home-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(1rem, 3vw, 1.25rem);
          color: #6b5d48;
          letter-spacing: 0.08em;
          line-height: 1.8;
          max-width: 340px;
          margin: 0 auto;
        }

        .home-actions {
          margin-top: 3.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          animation: fadeUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.2s;
        }

        .home-btn-primary {
          background: transparent;
          border: 1px solid #3a352d;
          color: #c4a97d;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 0.9rem 2.8rem;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .home-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(196, 169, 125, 0.07);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .home-btn-primary:hover {
          border-color: #c4a97d;
          color: #e8dfc8;
        }

        .home-btn-primary:hover::before {
          transform: scaleX(1);
        }

        .home-btn-secondary {
          background: none;
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #3a352d;
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
          background: #6b5d48;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .home-btn-secondary:hover {
          color: #6b5d48;
        }

        .home-btn-secondary:hover::after {
          width: 100%;
        }

        .home-footer {
          position: fixed;
          bottom: 2rem;
          font-size: 0.65rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #2a2720;
        }
      `}</style>

      <div className="home-root">
        <div className="home-inner">
          <h1 className="home-title">unsent</h1>
          <div className="home-divider" />
          <p className="home-tagline">
            a quiet place for the messages
            <br />
            you'll never send
          </p>
        </div>

        <div className="home-actions">
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
          no feeds &nbsp;·&nbsp; no sharing &nbsp;·&nbsp; no judgement
        </p>
      </div>
    </>
  );
}
