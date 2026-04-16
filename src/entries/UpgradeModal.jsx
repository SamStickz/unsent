import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function UpgradeModal({ onClose, reason }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    getUser();
  }, []);

  const handlePaystack = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const ref = `unsent_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const res = await fetch("/api/paystack-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, ref }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = `https://paystack.com/pay/${import.meta.env.VITE_PAYSTACK_PLAN_CODE}`;
      }
    } catch {
      window.location.href = `https://paystack.com/pay/${import.meta.env.VITE_PAYSTACK_PLAN_CODE}`;
    } finally {
      setLoading(false);
    }
  };

  const reasonText =
    {
      limit: "you've reached the 20 entry limit.",
      capsule: "time capsules are a pro feature.",
      export: "exporting is a pro feature.",
    }[reason] || "unlock the full unsent experience.";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');

        .upgrade-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,11,12,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 2rem;
          animation: fadeIn 0.3s ease both;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .upgrade-modal {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.4rem;
          animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .upgrade-reason {
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem;
          font-weight: 200;
          letter-spacing: 0.22em;
          text-transform: lowercase;
          color: #2a2d34;
        }

        .upgrade-title {
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: 1.9rem;
          color: #2e3138;
          letter-spacing: 0.08em;
          line-height: 1.2;
        }

        .upgrade-divider {
          width: 24px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #1e2026, transparent);
        }

        .upgrade-perks {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          width: 100%;
        }

        .upgrade-perk {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.95rem;
          color: #2a2d34;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          justify-content: center;
        }

        .upgrade-perk-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #3a3d44;
          flex-shrink: 0;
        }

        .upgrade-price {
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: lowercase;
          color: #2a2d34;
        }

        .upgrade-price strong {
          color: #4a4f5a;
          font-weight: 300;
        }

        .upgrade-btn {
          width: 100%;
          background: transparent;
          border: 1px solid #1c1e22;
          color: #2e3138;
          font-family: 'Inter', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: lowercase;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .upgrade-btn:hover { border-color: #2e3138; color: #6b7080; }
        .upgrade-btn:disabled { opacity: 0.15; cursor: default; pointer-events: none; }

        .upgrade-close {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.52rem; font-weight: 200;
          letter-spacing: 0.2em; text-transform: lowercase;
          color: #1e2026; padding: 0;
          transition: color 0.3s ease;
        }

        .upgrade-close:hover { color: #3a3d44; }
      `}</style>

      <div
        className="upgrade-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="upgrade-modal">
          <span className="upgrade-reason">{reasonText}</span>
          <h2 className="upgrade-title">unsent pro</h2>
          <div className="upgrade-divider" />

          <div className="upgrade-perks">
            {[
              "unlimited entries",
              "time capsules",
              "mood timeline",
              "anniversaries",
              "export to pdf",
            ].map((perk) => (
              <div key={perk} className="upgrade-perk">
                <div className="upgrade-perk-dot" />
                {perk}
              </div>
            ))}
          </div>

          <p className="upgrade-price">
            <strong>$3</strong> / month
          </p>

          <button
            className="upgrade-btn"
            onClick={handlePaystack}
            disabled={loading || !user}
          >
            {loading ? "opening payment…" : "continue to payment"}
          </button>

          <button className="upgrade-close" onClick={onClose}>
            not now
          </button>
        </div>
      </div>
    </>
  );
}
