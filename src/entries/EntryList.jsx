import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import EntryCard from "./EntryCard";
import { useNavigate } from "react-router-dom";

export default function EntryList() {
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setEntries(data);
      setLoading(false);
    };
    fetchEntries();
  }, [user]);

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@200;300&display=swap');

        .list-root {
          max-width: 640px;
          margin: 0 auto;
          padding: 3rem 2rem 6rem;
          font-family: 'Jost', sans-serif;
          animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .list-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .list-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.6rem;
          color: #e8dfc8;
          letter-spacing: 0.14em;
          text-transform: lowercase;
        }

        .list-subtitle {
          margin-top: 0.6rem;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.88rem;
          color: #7a6f5e;
          letter-spacing: 0.08em;
        }

        .list-divider {
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #2e2b26, transparent);
          margin: 1.2rem auto 0;
        }

        .list-loading {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1rem;
          color: #6b5d48;
          text-align: center;
          letter-spacing: 0.1em;
          padding: 4rem 0;
          animation: breathe 2.4s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.8; }
        }

        /* Empty state */
        .list-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4rem 0;
          animation: fadeUp 0.8s ease both;
          animation-delay: 0.2s;
        }

        .list-empty-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(180deg, transparent, #2e2b26, transparent);
          margin-bottom: 2rem;
        }

        .list-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.2rem;
          color: #a89880;
          letter-spacing: 0.06em;
          text-align: center;
          margin-bottom: 0.8rem;
        }

        .list-empty-sub {
          font-size: 0.68rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b5d48;
          text-align: center;
          line-height: 1.8;
          margin-bottom: 2.4rem;
        }

        .list-empty-btn {
          background: transparent;
          border: 1px solid #2e2b26;
          color: #c4a97d;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          padding: 0.7rem 1.8rem;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .list-empty-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(196,169,125,0.07);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .list-empty-btn:hover { border-color: #c4a97d; color: #e8dfc8; }
        .list-empty-btn:hover::before { transform: scaleX(1); }

        .list-count {
          font-size: 0.65rem;
          font-weight: 200;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6b5d48;
          text-align: center;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="list-root">
        <div className="list-header">
          <h2 className="list-title">what you've kept</h2>
          <div className="list-divider" />
          <p className="list-subtitle">
            words that never left, but needed somewhere to go
          </p>
        </div>

        {loading ? (
          <p className="list-loading">gathering your words…</p>
        ) : entries.length === 0 ? (
          <div className="list-empty">
            <div className="list-empty-line" />
            <p className="list-empty-title">nothing here yet</p>
            <p className="list-empty-sub">
              the words are waiting.
              <br />
              whenever you're ready.
            </p>
            <button className="list-empty-btn" onClick={() => navigate("/app")}>
              write something
            </button>
          </div>
        ) : (
          <>
            <p className="list-count">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </p>
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
