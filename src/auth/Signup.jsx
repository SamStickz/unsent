// Signup.jsx
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setError(error.message);
    navigate("/app");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .signup-root { min-height: 100vh; background-color: #111214; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; padding: 2rem; }
        .signup-card { width: 100%; max-width: 400px; animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .brand { text-align: center; margin-bottom: 3rem; }
        .brand-name { font-family: 'IM Fell English', serif; font-weight: 400; font-size: 2.4rem; color: #8a8f9a; letter-spacing: 0.1em; }
        .brand-tagline { margin-top: 0.5rem; font-family: 'Inter', sans-serif; font-size: 0.56rem; font-weight: 200; letter-spacing: 0.22em; text-transform: lowercase; color: #4a4f5a; }
        .divider { width: 24px; height: 1px; background: linear-gradient(90deg, transparent, #3a3d44, transparent); margin: 1rem auto 0; }
        .section-title { font-family: 'IM Fell English', serif; font-style: italic; font-weight: 400; font-size: 1.1rem; color: #6a6f7a; text-align: center; margin-bottom: 2.4rem; letter-spacing: 0.06em; }
        .field-group { margin-bottom: 1.4rem; position: relative; }
        .field-label { display: block; font-size: 0.58rem; font-weight: 300; letter-spacing: 0.2em; text-transform: lowercase; color: #5a5f6a; margin-bottom: 0.6rem; transition: color 0.3s ease; }
        .field-group.is-focused .field-label { color: #8a8f9a; }
        .field-input-wrap { position: relative; display: flex; align-items: center; }
        .field-input { width: 100%; background: transparent; border: none; border-bottom: 1px solid #2a2d34; padding: 0.6rem 0; padding-right: 2rem; font-family: 'IM Fell English', serif; font-size: 1rem; font-weight: 400; color: #8a8f9a; outline: none; transition: border-color 0.4s ease; letter-spacing: 0.04em; caret-color: #8a8f9a; }
        .field-input::placeholder { color: #3a3d44; font-style: italic; }
        .field-input:focus { border-bottom-color: #5a5f6a; }
        .field-line { position: absolute; bottom: 0; left: 0; height: 1px; width: 0%; background: #6a6f7a; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .field-group.is-focused .field-line { width: 100%; }
        .eye-btn { position: absolute; right: 0; background: none; border: none; cursor: pointer; padding: 0; color: #4a4f5a; transition: color 0.3s ease; display: flex; align-items: center; }
        .eye-btn:hover { color: #8a8f9a; }
        .eye-btn svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
        .error-msg { font-family: 'IM Fell English', serif; font-style: italic; font-size: 0.88rem; color: #9a6060; margin-bottom: 1.6rem; text-align: center; letter-spacing: 0.04em; }
        .signup-btn { width: 100%; margin-top: 2rem; padding: 0.9rem; background: transparent; border: 1px solid #2a2d34; color: #6a6f7a; font-family: 'Inter', sans-serif; font-size: 0.6rem; font-weight: 300; letter-spacing: 0.3em; text-transform: lowercase; cursor: pointer; transition: all 0.4s ease; }
        .signup-btn:hover { border-color: #6a6f7a; color: #c8cdd6; }
        .footer-links { margin-top: 2rem; text-align: center; }
        .footer-links a { font-size: 0.56rem; font-weight: 200; letter-spacing: 0.18em; text-transform: lowercase; color: #4a4f5a; text-decoration: none; cursor: pointer; transition: color 0.3s ease; }
        .footer-links a:hover { color: #8a8f9a; }
        .promise { margin-top: 3rem; text-align: center; font-family: 'IM Fell English', serif; font-style: italic; font-weight: 400; font-size: 0.9rem; color: #3a3d44; letter-spacing: 0.06em; line-height: 1.8; }
      `}</style>
      <div className="signup-root">
        <div className="signup-card">
          <div className="brand">
            <div className="brand-name">unsent</div>
            <div className="divider" />
            <div className="brand-tagline">for the words that stay</div>
          </div>
          <p className="section-title">begin here</p>
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
          <button className="signup-btn" onClick={handleSignup}>
            begin
          </button>
          <div className="footer-links">
            <a onClick={() => navigate("/login")}>already have an account</a>
          </div>
          <p className="promise">
            no feeds. no sharing.
            <br />
            just somewhere to put the words.
          </p>
        </div>
      </div>
    </>
  );
}
