import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return setError(error.message);
    setSent(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .forgot-root {
          min-height: 100vh;
          background-color: #0e0d0b;
          background-image:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(180,155,110,0.07) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Jost', sans-serif;
          padding: 2rem;
        }

        .forgot-card {
          width: 100%;
          max-width: 400px;
          animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .brand { text-align: center; margin-bottom: 3rem; }

        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 2.6rem;
          color: #e8dfc8;
          letter-spacing: 0.18em;
          text-transform: lowercase;
        }

        .divider {
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #6b5d48, transparent);
          margin: 1.2rem auto 0;
        }

        .forgot-title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.2rem;
          color: #d4c9b0;
          text-align: center;
          margin-bottom: 0.6rem;
          letter-spacing: 0.08em;
        }

        .forgot-subtitle {
          font-size: 0.86rem;
          font-weight: 200;
          letter-spacing: 0.14em;
          color: #e0d5be;
          text-align: center;
          margin-bottom: 2.4rem;
          line-height: 1.8;
        }

        .field-group { margin-bottom: 1.4rem; position: relative; }

        .field-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7a6f5e;
          margin-bottom: 0.6rem;
          transition: color 0.3s ease;
        }

        .field-group.is-focused .field-label { color: #7a6f5e; }

        .field-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #2e2b26;
          padding: 0.6rem 0;
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
          font-weight: 300;
          color: #e8dfc8;
          outline: none;
          transition: border-color 0.4s ease;
          letter-spacing: 0.04em;
          caret-color: #c4a97d;
        }

        .field-input::placeholder { color: #4a4439; }
        .field-input:focus { border-bottom-color: #c4a97d; }

        .field-line {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px; width: 0%;
          background: #c4a97d;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .field-group.is-focused .field-line { width: 100%; }

        .error-msg {
          font-size: 0.78rem;
          color: #b87474;
          margin-bottom: 1.6rem;
          text-align: center;
          letter-spacing: 0.1em;
        }

        .sent-msg {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.2rem;
          color: #ddd4bc;
          text-align: center;
          letter-spacing: 0.06em;
          line-height: 1.8;
          padding: 1rem 0 2rem;
          animation: fadeUp 0.6s ease both;
        }

        .forgot-btn {
          width: 100%;
          margin-top: 2rem;
          padding: 0.95rem;
          background: transparent;
          border: 1px solid #3a352d;
          color: #c4a97d;
          font-family: 'Jost', sans-serif;
          font-size: 1.2rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .forgot-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(196,169,125,0.07);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .forgot-btn:hover { border-color: #c4a97d; color: #e8dfc8; }
        .forgot-btn:hover::before { transform: scaleX(1); }

        .back-link {
          display: block;
          margin-top: 2rem;
          text-align: center;
          font-size: 0.84rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #e0d5be;
          cursor: pointer;
          transition: color 0.3s ease;
          background: none;
          border: none;
        }

        .back-link:hover { color: #c4a97d; }
      `}</style>

      <div className="forgot-root">
        <div className="forgot-card">
          <div className="brand">
            <div className="brand-name">unsent</div>
            <div className="divider" />
          </div>

          {!sent ? (
            <>
              <p className="forgot-title">find your way back</p>
              <p className="forgot-subtitle">
                enter your email and we'll send
                <br />a link to reset your password
              </p>

              {error && <p className="error-msg">{error}</p>}

              <div className={`field-group ${focused ? "is-focused" : ""}`}>
                <label className="field-label">Email</label>
                <input
                  type="email"
                  placeholder="you@somewhere.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="field-input"
                />
                <div className="field-line" />
              </div>

              <button className="forgot-btn" onClick={handleReset}>
                Send reset link
              </button>
            </>
          ) : (
            <p className="sent-msg">
              a link is on its way.
              <br />
              check your inbox and follow it home.
            </p>
          )}

          <button className="back-link" onClick={() => navigate("/login")}>
            back to login
          </button>
        </div>
      </div>
    </>
  );
}
