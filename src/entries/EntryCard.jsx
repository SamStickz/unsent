import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function EntryCard({ entry, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  const isSealed = entry.unlock_at && new Date(entry.unlock_at) > new Date();

  const formatDate = (ts) => {
    const d = new Date(ts);
    return (
      d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }) +
      "  ·  " +
      d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    );
  };

  const formatUnlockDate = (ts) => {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("entries")
      .delete()
      .eq("id", entry.id);
    if (!error) onDelete(entry.id);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@200;300&display=swap');

        .entry-card {
          padding: 2rem 0;
          border-bottom: 1px solid #1a1814;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Sealed capsule */
        .entry-card-sealed {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .entry-card-sealed-left {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .entry-card-seal-icon {
          font-size: 0.9rem;
          opacity: 0.4;
          margin-bottom: 0.2rem;
        }

        .entry-card-seal-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2e2b26;
        }

        .entry-card-seal-recipient {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.95rem;
          color: #3a352d;
          letter-spacing: 0.04em;
        }

        .entry-card-seal-date {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.82rem;
          color: #2a2720;
          letter-spacing: 0.04em;
          margin-top: 0.2rem;
        }

        .entry-card-seal-opens {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #2a2720;
        }

        /* Open card */
        .entry-card-recipient {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #3a352d;
          margin-bottom: 0.8rem;
        }

        .entry-card-recipient span {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          text-transform: none;
          color: #6b5d48;
          margin-left: 0.4rem;
        }

        .entry-card-content {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.05rem;
          color: #c4b99a;
          line-height: 1.85;
          letter-spacing: 0.02em;
          white-space: pre-wrap;
        }

        .entry-card-mood {
          display: inline-block;
          margin-top: 0.9rem;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.82rem;
          color: #3a352d;
          border: 1px solid #1e1c18;
          padding: 0.25rem 0.7rem;
          letter-spacing: 0.04em;
          border-radius: 1px;
        }

        .entry-card-meta {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .entry-card-date {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #2e2b26;
        }

        .entry-card-release {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2a2720;
          padding: 0;
          transition: color 0.3s ease;
          position: relative;
        }

        .entry-card-release::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0%; height: 1px;
          background: #6b3a3a;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .entry-card-release:hover { color: #8a4f4f; }
        .entry-card-release:hover::after { width: 100%; }

        .entry-card-confirm {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          animation: fadeIn 0.3s ease both;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .entry-card-confirm-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.82rem;
          color: #4a4439;
          letter-spacing: 0.06em;
        }

        .entry-card-confirm-yes {
          background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem; font-weight: 300;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #8a4f4f; padding: 0;
          transition: color 0.3s ease;
        }

        .entry-card-confirm-yes:hover { color: #c47474; }

        .entry-card-confirm-no {
          background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem; font-weight: 300;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #2e2b26; padding: 0;
          transition: color 0.3s ease;
        }

        .entry-card-confirm-no:hover { color: #6b5d48; }
      `}</style>

      <div className="entry-card">
        {isSealed ? (
          // Sealed capsule view
          <div className="entry-card-sealed">
            <div className="entry-card-sealed-left">
              <span className="entry-card-seal-icon">○</span>
              <span className="entry-card-seal-label">sealed</span>
              {entry.recipient && (
                <span className="entry-card-seal-recipient">
                  for {entry.recipient}
                </span>
              )}
              <span className="entry-card-seal-date">
                written {formatDate(entry.created_at)}
              </span>
              <span className="entry-card-seal-opens">
                opens {formatUnlockDate(entry.unlock_at)}
              </span>
            </div>
            {!confirming ? (
              <button
                className="entry-card-release"
                onClick={() => setConfirming(true)}
              >
                release
              </button>
            ) : (
              <div className="entry-card-confirm">
                <span className="entry-card-confirm-text">let this go?</span>
                <button
                  className="entry-card-confirm-yes"
                  onClick={handleDelete}
                >
                  yes
                </button>
                <button
                  className="entry-card-confirm-no"
                  onClick={() => setConfirming(false)}
                >
                  no
                </button>
              </div>
            )}
          </div>
        ) : (
          // Open entry view
          <>
            {entry.recipient && (
              <p className="entry-card-recipient">
                for <span>{entry.recipient}</span>
              </p>
            )}

            <p className="entry-card-content">{entry.content}</p>

            {entry.mood && (
              <span className="entry-card-mood">{entry.mood}</span>
            )}

            <div className="entry-card-meta">
              <span className="entry-card-date">
                {formatDate(entry.created_at)}
              </span>
              {!confirming ? (
                <button
                  className="entry-card-release"
                  onClick={() => setConfirming(true)}
                >
                  release
                </button>
              ) : (
                <div className="entry-card-confirm">
                  <span className="entry-card-confirm-text">let this go?</span>
                  <button
                    className="entry-card-confirm-yes"
                    onClick={handleDelete}
                  >
                    yes
                  </button>
                  <button
                    className="entry-card-confirm-no"
                    onClick={() => setConfirming(false)}
                  >
                    no
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
