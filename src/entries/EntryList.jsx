import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import EntryCard from "./EntryCard";
import { useNavigate } from "react-router-dom";

const MOOD_COLORS = {
  "still hurting": "#9b6b6b",
  "finding peace": "#7a9b8a",
  "letting go": "#c4a97d",
  "missing you": "#7a8a9b",
  "finally free": "#a89b6b",
  "not yet ready": "#8a7a9b",
  "grateful now": "#6b9b7a",
  "just numb": "#6b6b7a",
};

export default function EntryList() {
  const [entries, setEntries] = useState([]);
  const [replies, setReplies] = useState({});
  const [onThisDay, setOnThisDay] = useState(null);
  const [anniversary, setAnniversary] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [anniversaryDismissed, setAnniversaryDismissed] = useState(false);
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

      if (!error && data) {
        const topLevel = data.filter((e) => !e.is_reply);
        const replyEntries = data.filter((e) => e.is_reply);

        const replyMap = {};
        replyEntries.forEach((r) => {
          if (!replyMap[r.parent_id]) replyMap[r.parent_id] = [];
          replyMap[r.parent_id].push(r);
        });

        setEntries(topLevel);
        setReplies(replyMap);

        const today = new Date();

        // On This Day — same month/day, previous year
        const match = topLevel.find((e) => {
          const d = new Date(e.created_at);
          return (
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate() &&
            d.getFullYear() < today.getFullYear()
          );
        });
        if (match) setOnThisDay(match);

        // Anniversary — exact same month/day/year offset (1yr, 2yr etc)
        const anniv = topLevel.find((e) => {
          const d = new Date(e.created_at);
          const yearDiff = today.getFullYear() - d.getFullYear();
          return (
            yearDiff > 0 &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
          );
        });
        if (anniv) setAnniversary(anniv);
      }
      setLoading(false);
    };
    fetchEntries();
  }, [user]);

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (onThisDay?.id === id) setOnThisDay(null);
    if (anniversary?.id === id) setAnniversary(null);
  };

  const handleReply = (newReply) => {
    setReplies((prev) => ({
      ...prev,
      [newReply.parent_id]: [...(prev[newReply.parent_id] || []), newReply],
    }));
  };

  const yearsAgo = (ts) => {
    const diff = new Date().getFullYear() - new Date(ts).getFullYear();
    return diff === 1 ? "one year ago" : `${diff} years ago`;
  };

  // Mood frequency
  const moodFrequency = entries.reduce((acc, e) => {
    if (e.mood) acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});
  const moodEntries = Object.entries(moodFrequency).sort((a, b) => b[1] - a[1]);
  const maxCount = moodEntries[0]?.[1] || 1;

  // Mood timeline — group entries by month, pick dominant mood per month
  const moodTimeline = (() => {
    const byMonth = {};
    entries.forEach((e) => {
      if (!e.mood) return;
      const d = new Date(e.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!byMonth[key]) byMonth[key] = {};
      byMonth[key][e.mood] = (byMonth[key][e.mood] || 0) + 1;
    });
    return Object.entries(byMonth)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, moods]) => {
        const dominant = Object.entries(moods).sort(
          (a, b) => b[1] - a[1],
        )[0][0];
        const label = new Date(month + "-01").toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
        return { month, dominant, label, moods };
      });
  })();

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
          font-size: 1.75rem;
          color: #e8dfc8;
          letter-spacing: 0.14em;
          text-transform: lowercase;
        }

        .list-subtitle {
          margin-top: 0.6rem;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.96rem;
          color: #9a8e7e;
          letter-spacing: 0.08em;
        }

        .list-divider {
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #2e2b26, transparent);
          margin: 1.2rem auto 0;
        }

        /* Anniversary banner */
        .anniversary-banner {
          margin-bottom: 2rem;
          padding: 1.4rem 1.6rem;
          border: 1px solid #1e1c18;
          border-left: 2px solid #c4a97d;
          background: rgba(196,169,125,0.04);
          animation: fadeUp 0.8s ease both;
          position: relative;
        }

        .anniversary-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c4a97d;
          margin-bottom: 0.4rem;
          display: block;
        }

        .anniversary-years {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.08rem;
          color: #c4b99a;
          margin-bottom: 0.7rem;
          display: block;
          letter-spacing: 0.04em;
          line-height: 1.5;
        }

        .anniversary-content {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.08rem;
          color: #9a8e7e;
          line-height: 1.8;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          white-space: pre-wrap;
        }

        .anniversary-dismiss {
          position: absolute;
          top: 1rem; right: 1rem;
          background: none; border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem; font-weight: 200;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #5a5040; padding: 0;
          transition: color 0.3s ease;
        }
        .anniversary-dismiss:hover { color: #8a7a68; }

        /* On This Day */
        .on-this-day {
          margin-bottom: 2.4rem;
          padding: 1.4rem 1.6rem;
          border: 1px solid #1e1c18;
          border-left: 2px solid #6b5d48;
          background: rgba(196,169,125,0.02);
          animation: fadeUp 0.8s ease both;
          position: relative;
        }

        .on-this-day-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c4a97d;
          margin-bottom: 0.6rem;
          display: block;
        }

        .on-this-day-ago {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.9rem;
          color: #8a7a68;
          margin-bottom: 0.8rem;
          display: block;
          letter-spacing: 0.04em;
        }

        .on-this-day-content {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.08rem;
          color: #c4b99a;
          line-height: 1.8;
          white-space: pre-wrap;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .on-this-day-recipient {
          margin-top: 0.6rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 200;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8a7a68;
        }

        .on-this-day-dismiss {
          position: absolute;
          top: 1rem; right: 1rem;
          background: none; border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem; font-weight: 200;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #5a5040; padding: 0;
          transition: color 0.3s ease;
        }
        .on-this-day-dismiss:hover { color: #8a7a68; }

        /* Loading */
        .list-loading {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.08rem;
          color: #8a7a68;
          text-align: center;
          letter-spacing: 0.1em;
          padding: 4rem 0;
          animation: breathe 2.4s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.8; }
        }

        /* Empty */
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
          font-size: 1.28rem;
          color: #c4b99a;
          letter-spacing: 0.06em;
          text-align: center;
          margin-bottom: 0.8rem;
        }

        .list-empty-sub {
          font-size: 0.68rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8a7a68;
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
          font-size: 0.72rem;
          font-weight: 200;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #8a7a68;
          text-align: center;
          margin-bottom: 1rem;
        }

        /* Mood over time — weighted tags */
        .mood-map {
          margin-bottom: 2.4rem;
          padding: 1.4rem 0;
          border-top: 1px solid #1a1814;
          border-bottom: 1px solid #1a1814;
        }

        .mood-map-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #8a7a68;
          margin-bottom: 1rem;
          display: block;
          text-align: center;
        }

        .mood-map-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.6rem;
        }

        .mood-map-tag {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          letter-spacing: 0.04em;
          transition: opacity 0.3s ease;
          line-height: 1.4;
          cursor: default;
        }

        .mood-map-tag:hover { opacity: 1 !important; }

        /* Mood timeline graph */
        .mood-timeline {
          margin-top: 0.8rem;
          overflow-x: auto;
          padding-bottom: 0.4rem;
        }

        .mood-timeline-inner {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          min-width: max-content;
          padding: 0 0.4rem;
        }

        .mood-timeline-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }

        .mood-timeline-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: transform 0.3s ease;
          cursor: default;
        }

        .mood-timeline-dot:hover { transform: scale(1.6); }

        .mood-timeline-month {
          font-family: 'Jost', sans-serif;
          font-size: 0.5rem;
          font-weight: 200;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b5d48;
          white-space: nowrap;
        }

        .mood-timeline-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #1a1814, transparent);
          align-self: center;
          min-width: 8px;
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

        {/* Mood over time */}
        {!loading && moodEntries.length > 0 && (
          <div className="mood-map">
            <span className="mood-map-label">how you've been feeling</span>

            {/* Weighted tags */}
            <div className="mood-map-tags">
              {moodEntries.map(([m, count]) => {
                const scale = 0.78 + (count / maxCount) * 0.6;
                const opacity = 0.3 + (count / maxCount) * 0.7;
                const color = MOOD_COLORS[m] || "#c4a97d";
                return (
                  <span
                    key={m}
                    className="mood-map-tag"
                    style={{ fontSize: `${scale}rem`, opacity, color }}
                    title={`${count} ${count === 1 ? "time" : "times"}`}
                  >
                    {m}
                  </span>
                );
              })}
            </div>

            {/* Timeline graph — dots per month */}
            {moodTimeline.length > 1 && (
              <div className="mood-timeline">
                <div className="mood-timeline-inner">
                  {moodTimeline.map((point, i) => (
                    <>
                      <div key={point.month} className="mood-timeline-col">
                        <div
                          className="mood-timeline-dot"
                          style={{
                            background:
                              MOOD_COLORS[point.dominant] || "#c4a97d",
                          }}
                          title={`${point.label} — ${point.dominant}`}
                        />
                        <span className="mood-timeline-month">
                          {point.label}
                        </span>
                      </div>
                      {i < moodTimeline.length - 1 && (
                        <div key={`line-${i}`} className="mood-timeline-line" />
                      )}
                    </>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Anniversary banner — exact date, specific year */}
        {anniversary && !anniversaryDismissed && (
          <div className="anniversary-banner">
            <span className="anniversary-label">an anniversary</span>
            <span className="anniversary-years">
              {yearsAgo(anniversary.created_at)} today, you wrote something.
            </span>
            <p className="anniversary-content">{anniversary.content}</p>
            <button
              className="anniversary-dismiss"
              onClick={() => setAnniversaryDismissed(true)}
            >
              close
            </button>
          </div>
        )}

        {/* On This Day banner */}
        {onThisDay && !dismissed && onThisDay.id !== anniversary?.id && (
          <div className="on-this-day">
            <span className="on-this-day-label">on this day</span>
            <span className="on-this-day-ago">
              {yearsAgo(onThisDay.created_at)}, you wrote
            </span>
            <p className="on-this-day-content">{onThisDay.content}</p>
            {onThisDay.recipient && (
              <p className="on-this-day-recipient">for {onThisDay.recipient}</p>
            )}
            <button
              className="on-this-day-dismiss"
              onClick={() => setDismissed(true)}
            >
              close
            </button>
          </div>
        )}

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
              <EntryCard
                key={entry.id}
                entry={entry}
                onDelete={handleDelete}
                onReply={handleReply}
                replies={replies[entry.id] || []}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}
