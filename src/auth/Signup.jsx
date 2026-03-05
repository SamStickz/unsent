import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setError(error.message);
    navigate("/app");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .signup-root {
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

        .signup-card {
          width: 100%;
          max-width: 400px;
          animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .brand {
          text-align: center;
          margin-bottom: 3rem;
        }

        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 2.6rem;
          color: #e8dfc8;
          letter-spacing: 0.18em;
          text-transform: lowercase;
        }

        .brand-tagline {
          margin-top: 0.5rem;
          font-size: 0.72rem;
          font-weight: 200;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #7a6f5e;
        }

        .divider {
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #6b5d48, transparent);
          margin: 1.2rem auto 0;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1rem;
          color: #4a4439;
          text-align: center;
          margin-bottom: 2.4rem;
          letter-spacing: 0.08em;
        }

        .field-group {
          margin-bottom: 1.4rem;
          position: relative;
        }

        .field-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b5d48;
          margin-bottom: 0.6rem;
          transition: color 0.3s ease;
        }

        .field-group.is-focused .field-label {
          color: #c4a97d;
        }

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
        }

        .field-input::placeholder {
          color: #3a352d;
        }

        .field-input:focus {
          border-bottom-color: #c4a97d;
        }

        .field-line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 1px;
          width: 0%;
          background: #c4a97d;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .field-group.is-focused .field-line {
          width: 100%;
        }

        .error-msg {
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: #b87474;
          margin-bottom: 1.6rem;
          text-align: center;
          animation: fadeUp 0.4s ease both;
        }

        .signup-btn {
          width: 100%;
          margin-top: 2rem;
          padding: 0.95rem;
          background: transparent;
          border: 1px solid #3a352d;
          color: #c4a97d;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .signup-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(196, 169, 125, 0.07);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .signup-btn:hover {
          border-color: #c4a97d;
          color: #e8dfc8;
        }

        .signup-btn:hover::before {
          transform: scaleX(1);
        }

        .signup-btn:active {
          opacity: 0.7;
        }

        .footer-links {
          margin-top: 2.4rem;
          text-align: center;
        }

        .footer-links a {
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #4a4439;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #c4a97d;
        }

        .promise {
          margin-top: 3rem;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.82rem;
          color: #2e2b26;
          letter-spacing: 0.06em;
          line-height: 1.7;
        }
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
            <label className="field-label">Email</label>
            <input
              type="email"
              placeholder="you@somewhere.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className="field-input"
            />
            <div className="field-line" />
          </div>

          <div
            className={`field-group ${focused === "password" ? "is-focused" : ""}`}
          >
            <label className="field-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className="field-input"
            />
            <div className="field-line" />
          </div>

          <button className="signup-btn" onClick={handleSignup}>
            Begin
          </button>

          <div className="footer-links">
            <a href="/login">Already have an account</a>
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
