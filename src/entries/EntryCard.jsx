import { useState } from "react";
import { supabase } from "../lib/supabase";
import ShareCard from "./ShareCard";

export default function EntryCard({ entry, onDelete, onReply, replies = [] }) {
  const [confirming, setConfirming] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyFocused, setReplyFocused] = useState(false);
  const [sharing, setSharing] = useState(false);

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

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("entries")
      .insert({
        content: replyContent,
        user_id: session.user.id,
        parent_id: entry.id,
        is_reply: true,
      })
      .select()
      .single();

    if (!error) {
      setReplyContent("");
      setReplying(false);
      if (onReply) onReply(data);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@200;300&display=swap');

        .entry-card {
          padding: 2rem 0 1rem;
          border-bottom: 1px solid #1a1814;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Sealed */
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
          color: #6b5d48;
        }

        .entry-card-seal-recipient {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.95rem;
          color: #7a6f5e;
          letter-spacing: 0.04em;
        }

        .entry-card-seal-date {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.82rem;
          color: #6b5d48;
          letter-spacing: 0.04em;
        }

        .entry-card-seal-opens {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b5d48;
        }

        /* Open card */
        .entry-card-recipient {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #7a6f5e;
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
          color: #7a6f5e;
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
          color: #6b5d48;
        }

        .entry-card-actions {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .entry-card-action-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b5d48;
          padding: 0;
          transition: color 0.3s ease;
          position: relative;
        }

        .entry-card-action-btn::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0%; height: 1px;
          background: currentColor;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .entry-card-action-btn:hover { color: #c4a97d; }
        .entry-card-action-btn:hover::after { width: 100%; }

        .entry-card-release { color: #6b5d48; }
        .entry-card-release:hover { color: #8a4f4f !important; }

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
          color: #7a6f5e;
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
          color: #6b5d48; padding: 0;
          transition: color 0.3s ease;
        }

        .entry-card-confirm-no:hover { color: #c4a97d; }

        /* Reply compose */
        .reply-compose {
          margin-top: 1.2rem;
          padding-top: 1.2rem;
          border-top: 1px solid #161412;
          animation: fadeUp 0.4s ease both;
        }

        .reply-compose-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b5d48;
          margin-bottom: 0.6rem;
          display: block;
        }

        .reply-textarea {
          width: 100%;
          min-height: 100px;
          background: rgba(255,255,255,0.015);
          border: 1px solid #1a1814;
          border-radius: 2px;
          padding: 1rem;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1rem;
          color: #c4b99a;
          line-height: 1.8;
          resize: none;
          outline: none;
          transition: border-color 0.3s ease;
          caret-color: #c4a97d;
        }

        .reply-textarea::placeholder { color: #2e2b26; font-style: italic; }
        .reply-textarea:focus { border-color: #2a2720; }

        .reply-footer {
          margin-top: 0.8rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          align-items: center;
        }

        .reply-cancel {
          background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem; font-weight: 300;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #3a352d; padding: 0;
          transition: color 0.3s ease;
        }

        .reply-cancel:hover { color: #6b5d48; }

        .reply-send {
          background: transparent;
          border: 1px solid #2e2b26;
          color: #c4a97d;
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem; font-weight: 300;
          letter-spacing: 0.22em; text-transform: uppercase;
          padding: 0.5rem 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reply-send:hover { border-color: #c4a97d; color: #e8dfc8; }
        .reply-send:disabled { opacity: 0.2; cursor: default; pointer-events: none; }

        /* Replies */
        .replies-list {
          margin-top: 0.8rem;
          padding-left: 1.2rem;
          border-left: 1px solid #1a1814;
        }

        .reply-item {
          padding: 1rem 0;
          border-bottom: 1px solid #131210;
          animation: fadeUp 0.5s ease both;
        }

        .reply-item:last-child { border-bottom: none; }

        .reply-item-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 200;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #3a352d;
          margin-bottom: 0.4rem;
        }

        .reply-item-content {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 0.98rem;
          color: #a89880;
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .reply-item-date {
          margin-top: 0.5rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 200;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #2a2720;
        }
      `}</style>

      <div className="entry-card">
        {isSealed ? (
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
                className="entry-card-action-btn entry-card-release"
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
              <div className="entry-card-actions">
                {!confirming ? (
                  <>
                    <button
                      className="entry-card-action-btn"
                      onClick={() => setSharing(true)}
                    >
                      share
                    </button>
                    <button
                      className="entry-card-action-btn"
                      onClick={() => {
                        setReplying(!replying);
                        setConfirming(false);
                      }}
                    >
                      {replying ? "cancel" : "reply"}
                    </button>
                    <button
                      className="entry-card-action-btn entry-card-release"
                      onClick={() => setConfirming(true)}
                    >
                      release
                    </button>
                  </>
                ) : (
                  <div className="entry-card-confirm">
                    <span className="entry-card-confirm-text">
                      let this go?
                    </span>
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
            </div>

            {/* Reply compose box */}
            {replying && (
              <div className="reply-compose">
                <span className="reply-compose-label">your reply, now</span>
                <textarea
                  className="reply-textarea"
                  placeholder="what do you want to say back…"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onFocus={() => setReplyFocused(true)}
                  onBlur={() => setReplyFocused(false)}
                  autoFocus
                />
                <div className="reply-footer">
                  <button
                    className="reply-cancel"
                    onClick={() => {
                      setReplying(false);
                      setReplyContent("");
                    }}
                  >
                    cancel
                  </button>
                  <button
                    className="reply-send"
                    onClick={handleReply}
                    disabled={!replyContent.trim()}
                  >
                    keep this too
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {replies.length > 0 && (
              <div className="replies-list">
                {replies.map((reply) => (
                  <div key={reply.id} className="reply-item">
                    <p className="reply-item-label">you, later</p>
                    <p className="reply-item-content">{reply.content}</p>
                    <p className="reply-item-date">
                      {formatDate(reply.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {sharing && <ShareCard entry={entry} onClose={() => setSharing(false)} />}
    </>
  );
}
