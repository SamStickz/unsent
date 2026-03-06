import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const MOODS = [
  "still hurting",
  "finding peace",
  "letting go",
  "missing you",
  "finally free",
  "not yet ready",
  "grateful now",
  "just numb",
];

export default function NewEntry() {
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState("");
  const [mood, setMood] = useState(null);
  const [sealed, setSealed] = useState(false);
  const [unlockAt, setUnlockAt] = useState("");
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [acknowledgement, setAcknowledgement] = useState(null);
  const [ackVisible, setAckVisible] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    getUser();
  }, []);

  const getAcknowledgement = async (
    entryContent,
    entryMood,
    entryRecipient,
  ) => {
    try {
      const prompt = `Someone just wrote an unsent message${entryRecipient ? ` to "${entryRecipient}"` : ""}${entryMood ? ` and tagged it as "${entryMood}"` : ""}. 

Here is what they wrote:
"${entryContent.slice(0, 400)}"

Respond with a single short line — maximum 10 words — that quietly acknowledges what they've done. Not therapy. Not advice. Not a question. Just a gentle, poetic observation that makes them feel heard. The tone should be warm but understated, like a whisper. Examples of the right tone: "you found the words.", "that's been sitting with you for a while.", "you didn't have to explain yourself. but you did.", "it's safe here."

Reply with ONLY the single line. Nothing else.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 60,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const line = data.content?.[0]?.text?.trim();
      return line || null;
    } catch {
      return null;
    }
  };

  const handleSave = async () => {
    if (!content.trim() || !user) return;
    if (sealed && !unlockAt) return;

    const savedContent = content;
    const savedMood = mood;
    const savedRecipient = recipient;

    const { error } = await supabase.from("entries").insert({
      content,
      recipient: recipient.trim() || null,
      mood: mood || null,
      unlock_at: sealed ? new Date(unlockAt).toISOString() : null,
      user_id: user.id,
    });

    if (!error) {
      setContent("");
      setRecipient("");
      setMood(null);
      setSealed(false);
      setUnlockAt("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      // Get AI acknowledgement in background
      if (!sealed) {
        const line = await getAcknowledgement(
          savedContent,
          savedMood,
          savedRecipient,
        );
        if (line) {
          setAcknowledgement(line);
          setAckVisible(true);
          setTimeout(() => setAckVisible(false), 5000);
          setTimeout(() => setAcknowledgement(null), 5800);
        }
      }
    }
  };

  // Min date for capsule — tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        .entry-root {
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

        .entry-prompt {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.15rem;
          color: #c4b99a;
          text-align: center;
          margin-bottom: 2.4rem;
          letter-spacing: 0.06em;
          line-height: 1.7;
        }

        .recipient-group {
          margin-bottom: 1.6rem;
          position: relative;
        }

        .recipient-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7a6f5e;
          margin-bottom: 0.6rem;
          transition: color 0.3s ease;
        }

        .recipient-group.is-focused .recipient-label {
          color: #c4a97d;
        }

        .recipient-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #1e1c18;
          padding: 0.5rem 0;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.1rem;
          color: #e8dfc8;
          outline: none;
          transition: border-color 0.4s ease;
          letter-spacing: 0.04em;
          caret-color: #c4a97d;
        }

        .recipient-input::placeholder { color: #7a6f5e; font-style: italic; }

        .recipient-line {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px; width: 0%;
          background: #c4a97d;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .recipient-group.is-focused .recipient-line { width: 100%; }

        .entry-textarea {
          width: 100%;
          min-height: 220px;
          background: rgba(255,255,255,0.02);
          border: 1px solid #1e1c18;
          border-radius: 2px;
          padding: 1.6rem;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.15rem;
          color: #e8dfc8;
          line-height: 1.8;
          letter-spacing: 0.02em;
          resize: none;
          outline: none;
          transition: border-color 0.4s ease, background 0.4s ease;
          caret-color: #c4a97d;
        }

        .entry-textarea::placeholder { color: #7a6f5e; font-style: italic; }
        .entry-textarea:focus { border-color: #6b5d48; background: rgba(255,255,255,0.03); }

        .mood-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7a6f5e;
          margin: 1.6rem 0 0.8rem;
        }

        .mood-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .mood-tag {
          background: transparent;
          border: 1px solid #1e1c18;
          padding: 0.4rem 0.9rem;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.88rem;
          color: #7a6f5e;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.04em;
          border-radius: 1px;
        }

        .mood-tag:hover { border-color: #7a6f5e; color: #6b5d48; }
        .mood-tag.selected { border-color: #6b5d48; color: #c4a97d; background: rgba(196,169,125,0.05); }

        /* Capsule toggle */
        .capsule-row {
          margin-top: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-top: 1px solid #1a1814;
        }

        .capsule-label-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .capsule-label {
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7a6f5e;
        }

        .capsule-sublabel {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.82rem;
          color: #6b5d48;
          letter-spacing: 0.04em;
        }

        .capsule-toggle {
          position: relative;
          width: 36px;
          height: 20px;
          cursor: pointer;
        }

        .capsule-toggle input {
          opacity: 0;
          width: 0; height: 0;
        }

        .capsule-toggle-track {
          position: absolute;
          inset: 0;
          background: #1e1c18;
          border: 1px solid #2e2b26;
          border-radius: 20px;
          transition: all 0.4s ease;
        }

        .capsule-toggle input:checked + .capsule-toggle-track {
          background: rgba(196,169,125,0.15);
          border-color: #6b5d48;
        }

        .capsule-toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 12px; height: 12px;
          background: #3a352d;
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .capsule-toggle input:checked ~ .capsule-toggle-thumb {
          transform: translateX(16px);
          background: #c4a97d;
        }

        /* Date picker */
        .capsule-date-group {
          margin-top: 1rem;
          animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .capsule-date-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7a6f5e;
          margin-bottom: 0.6rem;
        }

        .capsule-date-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid #2e2b26;
          padding: 0.5rem 0;
          font-family: 'Jost', sans-serif;
          font-size: 0.88rem;
          font-weight: 300;
          color: #c4a97d;
          outline: none;
          letter-spacing: 0.06em;
          color-scheme: dark;
          cursor: pointer;
        }

        .capsule-date-hint {
          margin-top: 0.5rem;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.8rem;
          color: #6b5d48;
          letter-spacing: 0.04em;
        }

        /* Footer */
        .entry-footer {
          margin-top: 1.6rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Acknowledgement */
        .entry-ack {
          margin-top: 2rem;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.1rem;
          color: #a89880;
          letter-spacing: 0.06em;
          line-height: 1.7;
          transition: opacity 0.8s ease;
        }

        .entry-ack.visible { opacity: 1; }
        .entry-ack.hidden { opacity: 0; }

        .entry-char-count {
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: #6b5d48;
        }

        .entry-actions {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .entry-saved {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.85rem;
          color: #6b5d48;
          letter-spacing: 0.08em;
          animation: fadeIn 0.5s ease both;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .entry-save-btn {
          background: transparent;
          border: 1px solid #6b5d48;
          color: #e8dfc8;
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

        .entry-save-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(196,169,125,0.1);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .entry-save-btn:hover { border-color: #c4a97d; color: #e8dfc8; }
        .entry-save-btn:hover::before { transform: scaleX(1); }
        .entry-save-btn:disabled { opacity: 0.2; cursor: default; pointer-events: none; }
      `}</style>

      <div className="entry-root">
        <p className="entry-prompt">
          write the message you couldn't send.
          <br />
          this space is just for you.
        </p>

        <div
          className={`recipient-group ${focusedField === "recipient" ? "is-focused" : ""}`}
        >
          <label className="recipient-label">for</label>
          <input
            type="text"
            className="recipient-input"
            placeholder="a name, a memory, a version of yourself…"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            onFocus={() => setFocusedField("recipient")}
            onBlur={() => setFocusedField(null)}
          />
          <div className="recipient-line" />
        </div>

        <textarea
          className="entry-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setFocusedField("content")}
          onBlur={() => setFocusedField(null)}
          placeholder="say it here…"
        />

        <span className="mood-label">how this feels</span>
        <div className="mood-tags">
          {MOODS.map((m) => (
            <button
              key={m}
              className={`mood-tag ${mood === m ? "selected" : ""}`}
              onClick={() => setMood(mood === m ? null : m)}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Time capsule toggle */}
        <div className="capsule-row">
          <div className="capsule-label-group">
            <span className="capsule-label">seal as time capsule</span>
            <span className="capsule-sublabel">
              lock this until a future date
            </span>
          </div>
          <label className="capsule-toggle">
            <input
              type="checkbox"
              checked={sealed}
              onChange={(e) => setSealed(e.target.checked)}
            />
            <div className="capsule-toggle-track" />
            <div className="capsule-toggle-thumb" />
          </label>
        </div>

        {sealed && (
          <div className="capsule-date-group">
            <label className="capsule-date-label">open on</label>
            <input
              type="date"
              className="capsule-date-input"
              min={minDate}
              value={unlockAt}
              onChange={(e) => setUnlockAt(e.target.value)}
            />
            {unlockAt && (
              <p className="capsule-date-hint">
                this will stay sealed until{" "}
                {new Date(unlockAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        )}

        <div className="entry-footer">
          <span className="entry-char-count">
            {content.length > 0 ? `${content.length} characters` : ""}
          </span>
          <div className="entry-actions">
            {saved && (
              <span className="entry-saved">
                {sealed ? "sealed." : "kept."}
              </span>
            )}
            <button
              className="entry-save-btn"
              onClick={handleSave}
              disabled={!content.trim() || (sealed && !unlockAt)}
            >
              {sealed ? "Seal" : "Keep"}
            </button>
          </div>
        </div>

        {acknowledgement && (
          <p className={`entry-ack ${ackVisible ? "visible" : "hidden"}`}>
            {acknowledgement}
          </p>
        )}
      </div>
    </>
  );
}
