import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/login");
      } else {
        setUser(data.session.user);
        setLoading(false);
      }
    });
  }, []);

  if (loading)
    return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&display=swap');

        .auth-loading {
          min-height: 100vh;
          background-color: #0e0d0b;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-loading-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.1rem;
          color: #7a6f5e;
          letter-spacing: 0.2em;
          animation: breathe 2.4s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.8; }
        }
      `}</style>
        <div className="auth-loading">
          <span className="auth-loading-text">a moment…</span>
        </div>
      </>
    );

  return children;
}
