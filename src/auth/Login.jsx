import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return setError(error.message);
    navigate("/app");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background-color: #111214;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          padding: 2rem;
        }

        .login-card {
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
          font-size: 2.6rem;
          color: #c8cdd6;
          letter-spacing: 0.06em;
        }

        .brand-tagline {
          margin-top: 0.6rem;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 0.82rem;
          letter-spacing: 0.04em;
          color: #2e3138;
        }

        .divider {
          width: 24px;
          height: 1px;
          background: #1e2026;
          margin: 1rem auto 0;
        }

        .field-group {
          margin-bottom: 1.6rem;
          position: relative;
        }

        .field-label {
          display: block;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          color: #2a2d34;
          margin-bottom: 0.6rem;
          transition: color 0.3s ease;
        }

        .field-group.is-focused .field-label { color: #4a4f5a; }

        .field-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #1a1c20;
          padding: 0.6rem 0;
          padding-right: 2rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          font-weight: 300;
          color: #c8cdd6;
          outline: none;
          transition: border-color 0.4s ease;
          letter-spacing: 0.04em;
          caret-color: #4a4f5a;
        }

        .field-input::placeholder { color: #1e2026; }
        .field-input:focus { border-bottom-color: #2e3138; }

        .field-line {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px; width: 0%;
          background: #3a3d44;
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
          color: #222428;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
        }
        .eye-btn:hover { color: #4a4f5a; }
        .eye-btn svg {
          width: 15px; height: 15px;
          stroke: currentColor; fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .error-msg {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 0.82rem;
          color: #6b4a4a;
          margin-bottom: 1.6rem;
          text-align: center;
          animation: fadeUp 0.4s ease both;
          letter-spacing: 0.04em;
        }

        .login-btn {
          width: 100%;
          margin-top: 2rem;
          padding: 0.75rem;
          background: transparent;
          border: 1px solid #1e2026;
          color: #3a3d44;
          font-family: 'Inter', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: lowercase;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .login-btn:hover { border-color: #2e3138; color: #6b7080; }
        .login-btn:active { opacity: 0.7; }

        .footer-links {
          margin-top: 2.4rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-links a {
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: lowercase;
          color: #222428;
          text-decoration: none;
          transition: color 0.3s ease;
          cursor: pointer;
        }
        .footer-links a:hover { color: #4a4f5a; }
        .footer-sep { color: #1a1c20; margin: 0 0.8rem; font-size: 0.58rem; }
      `}</style>

      <div className="login-root">
        <div className="login-card">
          <div className="brand">
            <div className="brand-name">unsent</div>
            <div className="divider" />
            <div className="brand-tagline">for the words that stay</div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div
            className={`field-group ${focused === "email" ? "is-focused" : ""}`}
          >
            <label className="field-label">email</label>
            <div className="field-input-wrap">
              <input
                type="email"
                placeholder="you@somewhere.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                className="field-input"
              />
            </div>
            <div className="field-line" />
          </div>

          <div
            className={`field-group ${focused === "password" ? "is-focused" : ""}`}
          >
            <label className="field-label">password</label>
            <div className="field-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
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

          <button className="login-btn" onClick={handleLogin}>
            enter
          </button>

          <div className="footer-links">
            <a onClick={() => navigate("/forgot")}>forgot password</a>
            <span className="footer-sep">·</span>
            <a onClick={() => navigate("/signup")}>create account</a>
          </div>
        </div>
      </div>
    </>
  );
}
