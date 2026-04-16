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
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reset-root {
          min-height: 100vh;
          background-color: #111214;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
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
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: 2.4rem;
          color: #3a3d44;
          letter-spacing: 0.1em;
        }

        .divider {
          width: 24px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #1e2026, transparent);
          margin: 1rem auto 0;
        }

        .reset-title {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.1rem;
          color: #2e3138;
          text-align: center;
          margin-bottom: 2.4rem;
          letter-spacing: 0.06em;
        }

        .field-group { margin-bottom: 1.4rem; position: relative; }

        .field-label {
          display: block;
          font-size: 0.54rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          color: #1e2026;
          margin-bottom: 0.6rem;
          transition: color 0.3s ease;
        }

        .field-group.is-focused .field-label { color: #3a3d44; }

        .field-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #1c1e22;
          padding: 0.6rem 0;
          padding-right: 2rem;
          font-family: 'IM Fell English', serif;
          font-size: 1rem;
          font-weight: 400;
          color: #4a4f5a;
          outline: none;
          transition: border-color 0.4s ease;
          letter-spacing: 0.04em;
          caret-color: #3a3d44;
        }

        .field-input::placeholder { color: #1c1e22; font-style: italic; }
        .field-input:focus { border-bottom-color: #2e3138; }

        .field-line {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px; width: 0%;
          background: #2e3138;
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
          color: #1e2026;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
        }

        .eye-btn:hover { color: #3a3d44; }

        .eye-btn svg {
          width: 14px; height: 14px;
          stroke: currentColor; fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .error-msg {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 0.85rem;
          color: #7a4a4a;
          margin-bottom: 1.6rem;
          text-align: center;
          letter-spacing: 0.04em;
        }

        .done-msg {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.05rem;
          color: #2e3138;
          text-align: center;
          letter-spacing: 0.06em;
          line-height: 1.9;
          padding: 1rem 0 2rem;
          animation: fadeUp 0.6s ease both;
        }

        .reset-btn {
          width: 100%;
          margin-top: 2rem;
          padding: 0.9rem;
          background: transparent;
          border: 1px solid #1c1e22;
          color: #2e3138;
          font-family: 'Inter', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: lowercase;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .reset-btn:hover { border-color: #2e3138; color: #6b7080; }
        .reset-btn:disabled { opacity: 0.15; cursor: default; pointer-events: none; }
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
                <label className="field-label">new password</label>
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
                update password
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
