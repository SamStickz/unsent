import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setError(error.message);
    setDone(true);
    setTimeout(() => navigate("/app"), 2500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reset-root {
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

        .reset-card {
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

        .reset-title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.2rem;
          color: #d4c9b0;
          text-align: center;
          margin-bottom: 2.4rem;
          letter-spacing: 0.08em;
        }

        .field-group { margin-bottom: 1.4rem; position: relative; }

        .field-label {
          display: block;
          font-size: 0.84rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #d4c9b0;
          margin-bottom: 0.6rem;
          transition: color 0.3s ease;
        }

        .field-group.is-focused .field-label { color: #c4a97d; }

        .field-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #2e2b26;
          padding: 0.6rem 0;
          padding-right: 2rem;
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

        .eye-btn {
          position: absolute;
          right: 0;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          color: #4a4439;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
        }

        .eye-btn:hover { color: #d4c9b0; }

        .eye-btn svg {
          width: 16px; height: 16px;
          stroke: currentColor; fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .error-msg {
          font-size: 1.2rem;
          color: #b87474;
          margin-bottom: 1.6rem;
          text-align: center;
          letter-spacing: 0.1em;
        }

        .done-msg {
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

        .reset-btn {
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

        .reset-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(196,169,125,0.07);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reset-btn:hover { border-color: #c4a97d; color: #e8dfc8; }
        .reset-btn:hover::before { transform: scaleX(1); }
        .reset-btn:disabled { opacity: 0.2; cursor: default; pointer-events: none; }
      `}</style>

      <div className="reset-root">
        <div className="reset-card">
          <div className="brand">
            <div className="brand-name">unsent</div>
            <div className="divider" />
          </div>

          {!done ? (
            <>
              <p className="reset-title">choose a new password</p>
              {error && <p className="error-msg">{error}</p>}
              <div className={`field-group ${focused ? "is-focused" : ""}`}>
                <label className="field-label">New Password</label>
                <div className="field-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="field-input"
                  />
                  <button
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="field-line" />
              </div>
              <button
                className="reset-btn"
                onClick={handleUpdate}
                disabled={!password.trim()}
              >
                Update password
              </button>
            </>
          ) : (
            <p className="done-msg">
              password updated.
              <br />
              taking you back in…
            </p>
          )}
        </div>
      </div>
    </>
  );
}
