import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function ShareCard({ entry, onClose }) {
  const [showContent, setShowContent] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef(null);

  const formatDateLong = (ts) =>
    new Date(ts).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatDateShort = (ts) =>
    new Date(ts).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const generateImage = async () => {
    if (!cardRef.current) return null;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#111214",
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
    link.download = `unsent-${formatDateShort(entry.created_at).replace(/,? /g, "-")}.png`;
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
          await navigator.share({ files: [file], title: "unsent" });
        } catch (e) {
          /* cancelled */
        }
      } else {
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
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');

        .share-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,11,12,0.94);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1.5rem;
          animation: fadeIn 0.3s ease both;
          overflow-y: auto;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .share-modal {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
          padding: 1rem 0;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .share-modal-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem;
          font-weight: 300;
          letter-spacing: 0.24em;
          text-transform: lowercase;
          color: #2a2d34;
        }

        .share-card {
          width: 100%;
          background: #111214;
          border: 1px solid #1c1e22;
          padding: 2.2rem 2rem 2rem;
          position: relative;
          font-family: 'Inter', sans-serif;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .share-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.6rem;
        }

        .share-card-brand {
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: 0.8rem;
          color: #1e2026;
          letter-spacing: 0.1em;
        }

        .share-card-penned { text-align: right; }

        .share-card-penned-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.48rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: lowercase;
          color: #1c1e22;
          display: block;
          margin-bottom: 0.2rem;
        }

        .share-card-penned-date {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.75rem;
          color: #2a2d34;
          letter-spacing: 0.04em;
        }

        .share-card-body {
          flex: 1;
          margin-bottom: 1.8rem;
        }

        .share-card-content {
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: 0.95rem;
          color: #3a3d44;
          line-height: 1.9;
          letter-spacing: 0.02em;
          white-space: pre-wrap;
          display: -webkit-box;
          -webkit-line-clamp: 7;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .share-card-private {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.9rem;
          color: #1e2026;
          letter-spacing: 0.04em;
          line-height: 1.8;
        }

        .share-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .share-card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .share-card-recipient {
          font-family: 'Inter', sans-serif;
          font-size: 0.52rem;
          font-weight: 300;
          letter-spacing: 0.18em;
          text-transform: lowercase;
          color: #2a2d34;
        }

        .share-card-mood {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.78rem;
          color: #2e3138;
          letter-spacing: 0.04em;
        }

        .share-card-url {
          font-family: 'Inter', sans-serif;
          font-size: 0.46rem;
          font-weight: 200;
          letter-spacing: 0.12em;
          color: #1c1e22;
          text-transform: lowercase;
        }

        .share-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          border: 1px solid #1c1e22;
          padding: 0.7rem 1rem;
        }

        .share-toggle-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem;
          font-weight: 300;
          letter-spacing: 0.16em;
          text-transform: lowercase;
          color: #2a2d34;
        }

        .share-toggle-switch {
          position: relative;
          width: 32px; height: 18px;
          cursor: pointer; flex-shrink: 0;
        }

        .share-toggle-switch input { opacity: 0; width: 0; height: 0; }

        .share-toggle-track {
          position: absolute; inset: 0;
          background: #111214;
          border: 1px solid #1c1e22;
          border-radius: 18px;
          transition: all 0.3s ease;
        }

        .share-toggle-switch input:checked + .share-toggle-track {
          background: rgba(74,79,90,0.15);
          border-color: #3a3d44;
        }

        .share-toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 10px; height: 10px;
          background: #1e2026;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .share-toggle-switch input:checked ~ .share-toggle-thumb {
          transform: translateX(14px);
          background: #4a4f5a;
        }

        .share-actions {
          display: flex;
          gap: 0.8rem;
          width: 100%;
        }

        .share-btn {
          flex: 1;
          padding: 0.8rem;
          background: transparent;
          border: 1px solid #1c1e22;
          color: #2e3138;
          font-family: 'Inter', sans-serif;
          font-size: 0.56rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: lowercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .share-btn:hover { border-color: #2e3138; color: #6b7080; }
        .share-btn:disabled { opacity: 0.2; cursor: default; pointer-events: none; }

        .share-close {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem; font-weight: 200;
          letter-spacing: 0.2em; text-transform: lowercase;
          color: #1e2026; padding: 0;
          transition: color 0.3s ease;
        }

        .share-close:hover { color: #3a3d44; }
      `}</style>

      <div
        className="share-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="share-modal">
          <span className="share-modal-label">your card</span>

          <div ref={cardRef} className="share-card">
            <div className="share-card-top">
              <span className="share-card-brand">unsent</span>
              <div className="share-card-penned">
                <span className="share-card-penned-label">penned</span>
                <span className="share-card-penned-date">
                  {formatDateLong(entry.created_at)}
                </span>
              </div>
            </div>

            <div className="share-card-body">
              {showContent ? (
                <p className="share-card-content">{entry.content}</p>
              ) : (
                <p className="share-card-private">
                  some words are not mine to share.
                  <br />
                  but I wrote them, and that was enough.
                </p>
              )}
            </div>

            <div className="share-card-bottom">
              <div className="share-card-meta">
                {entry.recipient && (
                  <span className="share-card-recipient">
                    for {entry.recipient}
                  </span>
                )}
                {entry.mood && (
                  <span className="share-card-mood">{entry.mood}</span>
                )}
              </div>
              <span className="share-card-url">unsent-lemon.vercel.app</span>
            </div>
          </div>

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
