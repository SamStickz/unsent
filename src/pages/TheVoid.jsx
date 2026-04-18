import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import VoidNamePicker from "../components/VoidNamePicker";

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

const MOOD_COLORS = {
  "still hurting": "#9a7070",
  "finding peace": "#708a7a",
  "letting go": "#70789a",
  "missing you": "#70789a",
  "finally free": "#8a8070",
  "not yet ready": "#8a7070",
  "grateful now": "#708a70",
  "just numb": "#70707a",
};

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function TheVoid() {
  const [user, setUser] = useState(null);
  const [voidName, setVoidName] = useState(null);
  const [loadingName, setLoadingName] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(null);
  const [posting, setPosting] = useState(false);
  const [myMeToos, setMyMeToos] = useState(new Set());
  const [composing, setComposing] = useState(false);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);
      const { data: profile } = await supabase
        .from("profiles")
        .select("void_name")
        .eq("id", session.user.id)
        .single();
      setVoidName(profile?.void_name || null);
      setLoadingName(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!voidName) return;
    fetchPosts();
  }, [voidName]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    const { data } = await supabase
      .from("void_posts_named")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setPosts(data || []);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      const { data: meToos } = await supabase
        .from("void_me_too")
        .select("post_id")
        .eq("user_id", session.user.id);
      setMyMeToos(new Set((meToos || []).map((m) => m.post_id)));
    }
    setLoadingPosts(false);
  };

  const handlePost = async () => {
    if (!content.trim() || !user) return;
    setPosting(true);
    const { data, error } = await supabase
      .from("void_posts")
      .insert({ user_id: user.id, content: content.trim(), mood: mood || null })
      .select()
      .single();
    if (!error) {
      setPosts((prev) => [data, ...prev]);
      setContent("");
      setMood(null);
      setComposing(false);
    }
    setPosting(false);
  };

  const handleMeToo = async (post) => {
    if (!user) return;
    const already = myMeToos.has(post.id);
    if (already) {
      await supabase
        .from("void_me_too")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", post.id);
      await supabase
        .from("void_posts")
        .update({ me_too: Math.max(0, post.me_too - 1) })
        .eq("id", post.id);
      setMyMeToos((prev) => {
        const s = new Set(prev);
        s.delete(post.id);
        return s;
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, me_too: Math.max(0, p.me_too - 1) } : p,
        ),
      );
    } else {
      await supabase
        .from("void_me_too")
        .insert({ user_id: user.id, post_id: post.id });
      await supabase
        .from("void_posts")
        .update({ me_too: post.me_too + 1 })
        .eq("id", post.id);
      setMyMeToos((prev) => new Set([...prev, post.id]));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, me_too: p.me_too + 1 } : p,
        ),
      );
    }
  };

  if (loadingName) return null;
  if (!voidName)
    return (
      <VoidNamePicker userId={user?.id} onDone={(name) => setVoidName(name)} />
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');

        .void-root { padding: 2rem 0 6rem; animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .void-header { margin-bottom: 2.4rem; text-align: center; }

        .void-title {
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: 1.2rem;
          color: #6a6f7a;
          letter-spacing: 0.1em;
        }

        .void-identity {
          margin-top: 0.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.58rem;
          font-weight: 200;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          color: #4a4f5a;
        }

        .void-identity span {
          color: #8a8f9a;
          font-style: italic;
          font-family: 'IM Fell English', serif;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
        }

        .void-compose-btn {
          display: block;
          width: 100%;
          background: none;
          border: none;
          border-bottom: 1px solid #2a2d34;
          padding: 0.8rem 0;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.95rem;
          color: #5a5f6a;
          text-align: left;
          cursor: pointer;
          transition: color 0.3s ease;
          margin-bottom: 2rem;
          letter-spacing: 0.04em;
        }

        .void-compose-btn:hover { color: #8a8f9a; }

        .void-compose { margin-bottom: 2rem; animation: fadeUp 0.4s ease both; }

        .void-textarea {
          width: 100%;
          min-height: 120px;
          background: transparent;
          border: none;
          border-bottom: 1px solid #2a2d34;
          padding: 0.4rem 0;
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: 1.05rem;
          color: #8a8f9a;
          line-height: 1.9;
          resize: none;
          outline: none;
          caret-color: #8a8f9a;
          transition: border-color 0.3s ease;
        }

        .void-textarea::placeholder { color: #3a3d44; font-style: italic; }
        .void-textarea:focus { border-color: #4a4f5a; }

        .void-mood-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; }

        .void-mood-tag {
          background: transparent;
          border: none;
          border-bottom: 1px solid #2a2d34;
          padding: 0.15rem 0;
          margin-right: 0.5rem;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.85rem;
          color: #5a5f6a;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.04em;
        }

        .void-mood-tag:hover { color: #8a8f9a; border-color: #5a5f6a; }
        .void-mood-tag.selected { color: #c8cdd6; border-color: #8a8f9a; }

        .void-compose-footer { display: flex; justify-content: flex-end; gap: 1.4rem; align-items: center; margin-top: 0.8rem; }

        .void-cancel {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.58rem; font-weight: 300;
          letter-spacing: 0.2em; text-transform: lowercase;
          color: #4a4f5a; padding: 0;
          transition: color 0.3s ease;
        }
        .void-cancel:hover { color: #8a8f9a; }

        .void-post-btn {
          background: none; border: none;
          border-bottom: 1px solid #3a3d44;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.6rem; font-weight: 300;
          letter-spacing: 0.22em; text-transform: lowercase;
          color: #6a6f7a; padding: 0.2rem 0;
          transition: all 0.3s ease;
        }
        .void-post-btn:hover { color: #b0b5c0; border-color: #8a8f9a; }
        .void-post-btn:disabled { opacity: 0.2; cursor: default; pointer-events: none; }

        .void-post {
          padding: 2rem 0 1.4rem;
          border-bottom: 1px solid #1e2026;
          animation: fadeUp 0.5s ease both;
        }
        .void-post:last-child { border-bottom: none; }

        .void-post-content {
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: 1.05rem;
          color: #8a8f9a;
          line-height: 1.9;
          white-space: pre-wrap;
          margin-bottom: 0.9rem;
        }

        .void-post-mood {
          display: inline-block;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.75rem;
          border-bottom: 1px solid #2a2d34;
          padding: 0.1rem 0;
          margin-bottom: 0.9rem;
          letter-spacing: 0.04em;
        }

        .void-post-meta { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }

        .void-post-author {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.78rem;
          color: #5a5f6a;
          letter-spacing: 0.04em;
        }

        .void-post-right { display: flex; align-items: center; gap: 1rem; }

        .void-post-time {
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem;
          font-weight: 200;
          letter-spacing: 0.12em;
          text-transform: lowercase;
          color: #3a3d44;
        }

        .void-metoo {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.56rem; font-weight: 300;
          letter-spacing: 0.14em; text-transform: lowercase;
          color: #4a4f5a; padding: 0;
          transition: color 0.3s ease;
          display: flex; align-items: center; gap: 0.3rem;
        }
        .void-metoo:hover { color: #8a8f9a; }
        .void-metoo.active { color: #b0b5c0; }

        .void-empty { text-align: center; padding: 4rem 0; }

        .void-empty-text {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.95rem;
          color: #5a5f6a;
          letter-spacing: 0.06em;
          line-height: 2;
        }

        .void-loading {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.9rem;
          color: #4a4f5a;
          text-align: center;
          padding: 3rem 0;
          letter-spacing: 0.06em;
          animation: breathe 2.4s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.9; }
        }
      `}</style>

      <div className="void-root">
        <div className="void-header">
          <h2 className="void-title">the void</h2>
          <p className="void-identity">
            you are <span>{voidName}</span>
          </p>
        </div>

        {!composing ? (
          <button
            className="void-compose-btn"
            onClick={() => setComposing(true)}
          >
            pour something out…
          </button>
        ) : (
          <div className="void-compose">
            <textarea
              className="void-textarea"
              placeholder="say what you couldn't say anywhere else…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
            />
            <div className="void-mood-row">
              {MOODS.map((m) => (
                <button
                  key={m}
                  className={`void-mood-tag ${mood === m ? "selected" : ""}`}
                  style={
                    mood === m
                      ? { color: MOOD_COLORS[m], borderColor: MOOD_COLORS[m] }
                      : {}
                  }
                  onClick={() => setMood(mood === m ? null : m)}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="void-compose-footer">
              <button
                className="void-cancel"
                onClick={() => {
                  setComposing(false);
                  setContent("");
                  setMood(null);
                }}
              >
                cancel
              </button>
              <button
                className="void-post-btn"
                onClick={handlePost}
                disabled={!content.trim() || posting}
              >
                {posting ? "sending…" : "send into the void"}
              </button>
            </div>
          </div>
        )}

        {loadingPosts ? (
          <p className="void-loading">listening…</p>
        ) : posts.length === 0 ? (
          <div className="void-empty">
            <p className="void-empty-text">
              the void is quiet.
              <br />
              be the first to say something.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="void-post">
              <p className="void-post-content">{post.content}</p>
              {post.mood && (
                <span
                  className="void-post-mood"
                  style={{
                    color: MOOD_COLORS[post.mood] || "#6a6f7a",
                    borderColor: MOOD_COLORS[post.mood] || "#2a2d34",
                  }}
                >
                  {post.mood}
                </span>
              )}
              <div className="void-post-meta">
                <span className="void-post-author">
                  {post.void_name || "unknown"}
                </span>
                <div className="void-post-right">
                  <span className="void-post-time">
                    {timeAgo(post.created_at)}
                  </span>
                  <button
                    className={`void-metoo ${myMeToos.has(post.id) ? "active" : ""}`}
                    onClick={() => handleMeToo(post)}
                  >
                    me too {post.me_too > 0 && `· ${post.me_too}`}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
