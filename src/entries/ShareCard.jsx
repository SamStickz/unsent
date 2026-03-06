import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function ShareCard({ entry, onClose }) {
  const [showContent, setShowContent] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef(null);

  const formatDate = (ts) => {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const generateImage = async () => {
    if (!cardRef.current) return null;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0e0d0b",
        scale: 3,
        useCORS: true,
        logging: false,
      });
      return canvas;
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    const canvas = await generateImage();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "unsent.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleShare = async () => {
    const canvas = await generateImage();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      const file = new File([blob], "unsent.png", { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "unsent",
          });
        } catch (e) {
          // User cancelled — do nothing
        }
      } else {
        // Fallback to download
        const link = document.createElement("a");
        link.download = "unsent.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    }, "image/png");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        .share-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8, 7, 6, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1.5rem;
          animation: fadeIn 0.3s ease both;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .share-modal {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.4rem;
          animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .share-modal-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 300;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #6b5d48;
        }

        /* The actual card that gets captured */
        .share-card {
          width: 100%;
          background: #0e0d0b;
          border: 1px solid #2e2b26;
          padding: 2.4rem 2rem;
          position: relative;
          font-family: 'Jost', sans-serif;
        }

        .share-card-brand {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 0.85rem;
          color: #3a352d;
          letter-spacing: 0.22em;
          text-transform: lowercase;
          margin-bottom: 1.8rem;
        }

        .share-card-divider {
          width: 24px;
          height: 1px;
          background: #2e2b26;
          margin-bottom: 1.8rem;
        }

        .share-card-content {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.05rem;
          color: #c4b99a;
          line-height: 1.85;
          letter-spacing: 0.02em;
          white-space: pre-wrap;
          margin-bottom: 1.6rem;
          display: -webkit-box;
          -webkit-line-clamp: 8;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .share-card-private {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1rem;
          color: #3a352d;
          letter-spacing: 0.06em;
          margin-bottom: 1.6rem;
          line-height: 1.7;
        }

        .share-card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .share-card-recipient {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b5d48;
        }

        .share-card-mood {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.82rem;
          color: #7a6f5e;
          letter-spacing: 0.06em;
        }

        .share-card-date {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #2e2b26;
          margin-top: 0.2rem;
        }

        .share-card-url {
          position: absolute;
          bottom: 1.4rem;
          right: 1.6rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 200;
          letter-spacing: 0.14em;
          color: #2a2720;
          text-transform: lowercase;
        }

        /* Toggle */
        .share-toggle {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid #1e1c18;
          padding: 0.5rem 1rem;
        }

        .share-toggle-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 300;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #6b5d48;
        }

        .share-toggle-switch {
          position: relative;
          width: 32px;
          height: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .share-toggle-switch input { opacity: 0; width: 0; height: 0; }

        .share-toggle-track {
          position: absolute;
          inset: 0;
          background: #1e1c18;
          border: 1px solid #2e2b26;
          border-radius: 18px;
          transition: all 0.3s ease;
        }

        .share-toggle-switch input:checked + .share-toggle-track {
          background: rgba(196,169,125,0.12);
          border-color: #6b5d48;
        }

        .share-toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 10px; height: 10px;
          background: #3a352d;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .share-toggle-switch input:checked ~ .share-toggle-thumb {
          transform: translateX(14px);
          background: #c4a97d;
        }

        /* Actions */
        .share-actions {
          display: flex;
          gap: 0.8rem;
          width: 100%;
        }

        .share-btn {
          flex: 1;
          padding: 0.8rem;
          background: transparent;
          border: 1px solid #2e2b26;
          color: #c4a97d;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .share-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(196,169,125,0.07);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .share-btn:hover { border-color: #c4a97d; color: #e8dfc8; }
        .share-btn:hover::before { transform: scaleX(1); }
        .share-btn:disabled { opacity: 0.3; cursor: default; pointer-events: none; }

        .share-close {
          background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem; font-weight: 300;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #3a352d;
          padding: 0;
          transition: color 0.3s ease;
        }

        .share-close:hover { color: #6b5d48; }
      `}</style>

      <div
        className="share-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="share-modal">
          <span className="share-modal-label">your card</span>

          {/* Card preview — this gets captured */}
          <div ref={cardRef} className="share-card">
            <div className="share-card-brand">unsent</div>
            <div className="share-card-divider" />

            {showContent ? (
              <p className="share-card-content">{entry.content}</p>
            ) : (
              <p className="share-card-private">
                some words are not mine to share.
                <br />
                but I wrote them, and that was enough.
              </p>
            )}

            <div className="share-card-meta">
              {entry.recipient && (
                <span className="share-card-recipient">
                  for {entry.recipient}
                </span>
              )}
              {entry.mood && (
                <span className="share-card-mood">{entry.mood}</span>
              )}
              <span className="share-card-date">
                {formatDate(entry.created_at)}
              </span>
            </div>

            <span className="share-card-url">unsent-lemon.vercel.app</span>
          </div>

          {/* Toggle */}
          <div className="share-toggle">
            <span className="share-toggle-label">
              {showContent ? "showing your words" : "words hidden"}
            </span>
            <label className="share-toggle-switch">
              <input
                type="checkbox"
                checked={showContent}
                onChange={(e) => setShowContent(e.target.checked)}
              />
              <div className="share-toggle-track" />
              <div className="share-toggle-thumb" />
            </label>
          </div>

          {/* Actions */}
          <div className="share-actions">
            <button
              className="share-btn"
              onClick={handleDownload}
              disabled={generating}
            >
              {generating ? "creating…" : "download"}
            </button>
            <button
              className="share-btn"
              onClick={handleShare}
              disabled={generating}
            >
              {generating ? "creating…" : "share"}
            </button>
          </div>

          <button className="share-close" onClick={onClose}>
            close
          </button>
        </div>
      </div>
    </>
  );
}
