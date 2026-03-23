import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useProStatus } from "../lib/useProStatus";
import UpgradeModal from "./UpgradeModal";

const FREE_LIMIT = 20;

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
  const [toSelf, setToSelf] = useState(false);
  const [selfMode, setSelfMode] = useState(null); // "then" | "later"
  const [selfAge, setSelfAge] = useState("");
  const { isPro } = useProStatus();
  const [entryCount, setEntryCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("limit");

  useEffect(() => {
    const getCount = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      const { count } = await supabase
        .from("entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.user.id)
        .eq("is_reply", false);
      setEntryCount(count || 0);
    };
    getCount();
  }, []);

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

  const getEffectiveRecipient = () => {
    if (!toSelf) return recipient.trim() || null;
    if (selfMode === "then") return selfAge ? `me at ${selfAge}` : "me then";
    if (selfMode === "later") return "me later";
    return "myself";
  };

  const handleSave = async () => {
    if (!content.trim() || !user) return;
    if (sealed && !unlockAt) return;

    // Check entry limit for free users
    if (!isPro && entryCount >= FREE_LIMIT) {
      setUpgradeReason("limit");
      setShowUpgrade(true);
      return;
    }

    const savedContent = content;
    const savedMood = mood;
    const savedRecipient = getEffectiveRecipient();

    const { error } = await supabase.from("entries").insert({
      content,
      recipient: getEffectiveRecipient(),
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
      setSelfAge("");
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

        /* To self toggle — text switcher, no border box */
        .to-toggle {
          display: flex;
          gap: 1.4rem;
          margin-bottom: 2rem;
          align-items: center;
        }

        .to-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #3a352d;
          padding: 0;
          transition: color 0.3s ease;
          position: relative;
          padding-bottom: 3px;
        }

        .to-toggle-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0%;
          height: 1px;
          background: #c4a97d;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .to-toggle-btn.active {
          color: #c4a97d;
        }

        .to-toggle-btn.active::after { width: 100%; }
        .to-toggle-sep { color: #2a2720; font-size: 0.6rem; }

        /* Self mode selector */
        .self-mode-group {
          margin-bottom: 1.6rem;
          animation: fadeUp 0.4s ease both;
        }

        .self-mode-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 200;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #e0d5be;
          display: block;
          margin-bottom: 0.8rem;
        }

        .self-mode-options {
          display: flex;
          gap: 0.8rem;
        }

        .self-mode-btn {
          background: none;
          border: 1px solid #1e1c18;
          cursor: pointer;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.4rem;
          color: #e0d5be;
          padding: 0.4rem 1rem;
          letter-spacing: 0.04em;
          transition: all 0.3s ease;
        }

        .self-mode-btn.active {
          border-color: #e0d5be;
          color: #e0d5be;
          background: rgba(196,169,125,0.05);
        }

        .self-age-group {
          margin-top: 1rem;
          animation: fadeUp 0.3s ease both;
        }

        .self-age-input {
          background: none;
          border: none;
          border-bottom: 1px solid #2a2720;
          color: #e0d5be;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.2rem;
          letter-spacing: 0.04em;
          padding: 0.4rem 0;
          width: 160px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .self-age-input::placeholder { color: #2a2720; }
        .self-age-input:focus { border-color: #c4a97d; }
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
          font-size: 1.35rem;
          color: #e0d5be;
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
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #4a4030;
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
          font-size: 1.3rem;
          color: #e8dfc8;
          outline: none;
          transition: border-color 0.4s ease;
          letter-spacing: 0.04em;
          caret-color: #c4a97d;
        }

        .recipient-input::placeholder { color: #d4c9b0; font-style: italic; }

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
          font-size: 1.35rem;
          color: #e8dfc8;
          line-height: 1.8;
          letter-spacing: 0.02em;
          resize: none;
          outline: none;
          transition: border-color 0.4s ease, background 0.4s ease;
          caret-color: #c4a97d;
        }

        .entry-textarea::placeholder { color: #d4c9b0; font-style: italic; }
        .entry-textarea:focus { border-color: #e0d5be; background: rgba(255,255,255,0.03); }

        .mood-label {
          display: block;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #4a4030;
          margin: 1.6rem 0 0.8rem;
        }

        .mood-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .mood-tag {
          background: transparent;
          border: none;
          border-bottom: 1px solid #1a1814;
          padding: 0.2rem 0;
          margin-right: 0.6rem;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.88rem;
          color: #3a352d;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.04em;
          border-radius: 0;
        }

        .mood-tag:hover { color: #8a7a68; border-color: #3a352d; }
        .mood-tag.selected { color: #c4a97d; border-color: #c4a97d; }

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
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #d4c9b0;
        }

        .capsule-sublabel {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.68rem;
          color: #e0d5be;
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
          border-color: #e0d5be;
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
          font-size: 0.84rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #d4c9b0;
          margin-bottom: 0.6rem;
        }

        .capsule-date-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid #2e2b26;
          padding: 0.5rem 0;
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
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
          font-size: 0.94rem;
          color: #e0d5be;
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
          font-size: 1.3rem;
          color: #e0d5be;
          letter-spacing: 0.06em;
          line-height: 1.7;
          transition: opacity 0.8s ease;
        }

        .entry-ack.visible { opacity: 1; }
        .entry-ack.hidden { opacity: 0; }

        .entry-char-count {
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: #e0d5be;
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
          font-size: 0.82rem;
          color: #e0d5be;
          letter-spacing: 0.08em;
          animation: fadeIn 0.5s ease both;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .entry-save-btn {
          background: transparent;
          border: none;
          border-bottom: 1px solid #3a352d;
          color: #8a7a68;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          padding: 0.3rem 0;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
        }

        .entry-save-btn:hover { color: #c4a97d; border-color: #c4a97d; }
        .entry-save-btn:disabled { opacity: 0.2; cursor: default; pointer-events: none; }
      `}</style>

      <div className="entry-root">
        <p className="entry-prompt">
          write the message you couldn't send.
          <br />
          this space is just for you.
        </p>

        {/* To someone / to myself toggle */}
        <div className="to-toggle">
          <button
            className={`to-toggle-btn ${!toSelf ? "active" : ""}`}
            onClick={() => {
              setToSelf(false);
              setSelfMode(null);
            }}
          >
            to someone
          </button>
          <button
            className={`to-toggle-btn ${toSelf ? "active" : ""}`}
            onClick={() => setToSelf(true)}
          >
            to myself
          </button>
        </div>

        {/* Recipient — someone else */}
        {!toSelf && (
          <div
            className={`recipient-group ${focusedField === "recipient" ? "is-focused" : ""}`}
          >
            <label className="recipient-label">for</label>
            <input
              type="text"
              className="recipient-input"
              placeholder="a name, a feeling, or leave it open…"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              onFocus={() => setFocusedField("recipient")}
              onBlur={() => setFocusedField(null)}
            />
            <div className="recipient-line" />
          </div>
        )}

        {/* Self mode — past or future */}
        {toSelf && (
          <div className="self-mode-group">
            <span className="self-mode-label">which version?</span>
            <div className="self-mode-options">
              <button
                className={`self-mode-btn ${selfMode === "then" ? "active" : ""}`}
                onClick={() => setSelfMode("then")}
              >
                me then
              </button>
              <button
                className={`self-mode-btn ${selfMode === "later" ? "active" : ""}`}
                onClick={() => setSelfMode("later")}
              >
                me later
              </button>
            </div>
            {selfMode === "then" && (
              <div className="self-age-group">
                <input
                  type="text"
                  className="self-age-input"
                  placeholder="at what age or year?"
                  value={selfAge}
                  onChange={(e) => setSelfAge(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        <textarea
          className="entry-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setFocusedField("content")}
          onBlur={() => setFocusedField(null)}
          placeholder={
            toSelf && selfMode === "then"
              ? "what would you tell that version of you…"
              : toSelf && selfMode === "later"
                ? "what do you want your future self to know…"
                : "say what's on your mind…"
          }
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
              {isPro
                ? "lock this until a future date"
                : "pro feature — unlock to use"}
            </span>
          </div>
          <label className="capsule-toggle">
            <input
              type="checkbox"
              checked={sealed}
              onChange={(e) => {
                if (!isPro) {
                  setUpgradeReason("capsule");
                  setShowUpgrade(true);
                  return;
                }
                setSealed(e.target.checked);
              }}
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

      {showUpgrade && (
        <UpgradeModal
          reason={upgradeReason}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </>
  );
}
