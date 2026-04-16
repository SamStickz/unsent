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
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .forgot-root {
          min-height: 100vh;
          background-color: #111214;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
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

        .forgot-title {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.1rem;
          color: #2e3138;
          text-align: center;
          margin-bottom: 0.6rem;
          letter-spacing: 0.06em;
        }

        .forgot-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: lowercase;
          color: #1e2026;
          text-align: center;
          margin-bottom: 2.4rem;
          line-height: 2;
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

        .field-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #1c1e22;
          padding: 0.6rem 0;
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

        .error-msg {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 0.85rem;
          color: #7a4a4a;
          margin-bottom: 1.6rem;
          text-align: center;
          letter-spacing: 0.04em;
        }

        .sent-msg {
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

        .forgot-btn {
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

        .forgot-btn:hover { border-color: #2e3138; color: #6b7080; }

        .back-link {
          display: block;
          margin-top: 2rem;
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: lowercase;
          color: #1e2026;
          cursor: pointer;
          transition: color 0.3s ease;
          background: none;
          border: none;
        }

        .back-link:hover { color: #3a3d44; }
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
                <label className="field-label">email</label>
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
                send reset link
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
