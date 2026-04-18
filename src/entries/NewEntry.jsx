import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useProStatus } from "../lib/useProStatus";
import UpgradeModal from "./UpgradeModal";
import { useLang } from "../lib/LangContext";

const FREE_LIMIT = 20;

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
  const [selfMode, setSelfMode] = useState(null);
  const [selfAge, setSelfAge] = useState("");
  const { isPro } = useProStatus();
  const { t } = useLang();
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
    if (selfMode === "then") return selfAge ? `me at ${selfAge}` : t.me_then;
    if (selfMode === "later") return t.me_later;
    return "myself";
  };

  const handleSave = async () => {
    if (!content.trim() || !user) return;
    if (sealed && !unlockAt) return;
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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');

        .entry-root {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          padding: 3rem 0 6rem;
          font-family: 'Inter', sans-serif;
          animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .entry-prompt {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1rem;
          color: #6a6f7a;
          text-align: center;
          margin-bottom: 2.4rem;
          letter-spacing: 0.06em;
          line-height: 1.8;
        }

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
          font-family: 'Inter', sans-serif;
          font-size: 0.62rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: lowercase;
          color: #5a5f6a;
          padding: 0;
          padding-bottom: 3px;
          transition: color 0.3s ease;
          position: relative;
        }

        .to-toggle-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0%;
          height: 1px;
          background: #8a8f9a;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .to-toggle-btn.active { color: #b0b5c0; }
        .to-toggle-btn.active::after { width: 100%; }

        .self-mode-group {
          margin-bottom: 1.6rem;
          animation: fadeUp 0.4s ease both;
        }

        .self-mode-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          color: #5a5f6a;
          display: block;
          margin-bottom: 0.8rem;
        }

        .self-mode-options { display: flex; gap: 0.8rem; }

        .self-mode-btn {
          background: none;
          border: 1px solid #2a2d34;
          cursor: pointer;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.2rem;
          color: #6a6f7a;
          padding: 0.4rem 1rem;
          letter-spacing: 0.04em;
          transition: all 0.3s ease;
        }

        .self-mode-btn.active { border-color: #6a6f7a; color: #b0b5c0; }

        .self-age-group { margin-top: 1rem; animation: fadeUp 0.3s ease both; }

        .self-age-input {
          background: none;
          border: none;
          border-bottom: 1px solid #2a2d34;
          color: #8a8f9a;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.1rem;
          letter-spacing: 0.04em;
          padding: 0.4rem 0;
          width: 160px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .self-age-input::placeholder { color: #3a3d44; font-style: italic; }
        .self-age-input:focus { border-color: #5a5f6a; }

        .recipient-group { margin-bottom: 1.6rem; position: relative; }

        .recipient-label {
          display: block;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          color: #5a5f6a;
          margin-bottom: 0.6rem;
          transition: color 0.3s ease;
        }

        .recipient-group.is-focused .recipient-label { color: #8a8f9a; }

        .recipient-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #2a2d34;
          padding: 0.5rem 0;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.05rem;
          color: #8a8f9a;
          outline: none;
          transition: border-color 0.4s ease;
          letter-spacing: 0.04em;
          caret-color: #8a8f9a;
        }

        .recipient-input::placeholder { color: #3a3d44; font-style: italic; }

        .recipient-line {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px; width: 0%;
          background: #6a6f7a;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .recipient-group.is-focused .recipient-line { width: 100%; }

        .entry-textarea {
          width: 100%;
          min-height: 200px;
          background: transparent;
          border: none;
          border-bottom: 1px solid #2a2d34;
          padding: 0.8rem 0;
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: 1.1rem;
          color: #8a8f9a;
          line-height: 1.9;
          letter-spacing: 0.02em;
          resize: none;
          outline: none;
          transition: border-color 0.4s ease;
          caret-color: #8a8f9a;
        }

        .entry-textarea::placeholder { color: #3a3d44; font-style: italic; }
        .entry-textarea:focus { border-color: #4a4f5a; }

        .mood-label {
          display: block;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          color: #5a5f6a;
          margin: 1.6rem 0 0.8rem;
        }

        .mood-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }

        .mood-tag {
          background: transparent;
          border: none;
          border-bottom: 1px solid #2a2d34;
          padding: 0.2rem 0;
          margin-right: 0.6rem;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.88rem;
          color: #5a5f6a;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.04em;
          border-radius: 0;
        }

        .mood-tag:hover { color: #8a8f9a; border-color: #5a5f6a; }
        .mood-tag.selected { color: #c8cdd6; border-color: #8a8f9a; }

        .capsule-row {
          margin-top: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-top: 1px solid #2a2d34;
        }

        .capsule-label-group { display: flex; flex-direction: column; gap: 0.3rem; }

        .capsule-label {
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          color: #5a5f6a;
        }

        .capsule-sublabel {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.72rem;
          color: #3a3d44;
          letter-spacing: 0.04em;
        }

        .capsule-toggle { position: relative; width: 36px; height: 20px; cursor: pointer; }
        .capsule-toggle input { opacity: 0; width: 0; height: 0; }

        .capsule-toggle-track {
          position: absolute; inset: 0;
          background: #111214;
          border: 1px solid #2a2d34;
          border-radius: 20px;
          transition: all 0.4s ease;
        }

        .capsule-toggle input:checked + .capsule-toggle-track {
          background: rgba(106,111,122,0.2);
          border-color: #6a6f7a;
        }

        .capsule-toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 12px; height: 12px;
          background: #2a2d34;
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .capsule-toggle input:checked ~ .capsule-toggle-thumb {
          transform: translateX(16px);
          background: #8a8f9a;
        }

        .capsule-date-group { margin-top: 1rem; animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }

        .capsule-date-label {
          display: block;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          color: #5a5f6a;
          margin-bottom: 0.6rem;
        }

        .capsule-date-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid #2a2d34;
          padding: 0.5rem 0;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #8a8f9a;
          outline: none;
          letter-spacing: 0.06em;
          color-scheme: dark;
          cursor: pointer;
        }

        .capsule-date-hint {
          margin-top: 0.5rem;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.9rem;
          color: #6a6f7a;
          letter-spacing: 0.04em;
        }

        .entry-footer {
          margin-top: 1.6rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .entry-char-count {
          font-size: 0.56rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: #3a3d44;
        }

        .entry-actions { display: flex; align-items: center; gap: 1.2rem; }

        .entry-saved {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.82rem;
          color: #8a8f9a;
          letter-spacing: 0.08em;
          animation: fadeIn 0.5s ease both;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .entry-save-btn {
          background: transparent;
          border: none;
          border-bottom: 1px solid #3a3d44;
          color: #6a6f7a;
          font-family: 'Inter', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: lowercase;
          padding: 0.3rem 0;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .entry-save-btn:hover { color: #b0b5c0; border-color: #8a8f9a; }
        .entry-save-btn:disabled { opacity: 0.2; cursor: default; pointer-events: none; }

        .entry-ack {
          margin-top: 2rem;
          text-align: center;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.2rem;
          color: #8a8f9a;
          letter-spacing: 0.06em;
          line-height: 1.7;
          transition: opacity 0.8s ease;
        }

        .entry-ack.visible { opacity: 1; }
        .entry-ack.hidden { opacity: 0; }
      `}</style>

      <div className="entry-root">
        <p className="entry-prompt">
          {t.write_prompt.split("\n")[0]}
          <br />
          {t.write_prompt.split("\n")[1]}
        </p>

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

        {!toSelf && (
          <div
            className={`recipient-group ${focusedField === "recipient" ? "is-focused" : ""}`}
          >
            <label className="recipient-label">for</label>
            <input
              type="text"
              className="recipient-input"
              placeholder={t.recipient_placeholder}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              onFocus={() => setFocusedField("recipient")}
              onBlur={() => setFocusedField(null)}
            />
            <div className="recipient-line" />
          </div>
        )}

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
          {t.moods.map((m) => (
            <button
              key={m}
              className={`mood-tag ${mood === m ? "selected" : ""}`}
              onClick={() => setMood(mood === m ? null : m)}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="capsule-row">
          <div className="capsule-label-group">
            <span className="capsule-label">seal as time capsule</span>
            <span className="capsule-sublabel">
              {isPro ? t.capsule_sub : "pro feature — unlock to use"}
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
              {sealed ? "seal" : "keep"}
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
