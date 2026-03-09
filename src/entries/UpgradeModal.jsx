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

  const handlePaystack = () => {
    if (!user) return;
    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      plan: import.meta.env.VITE_PAYSTACK_PLAN_CODE,
      currency: "USD",
      callback: async (response) => {
        // Payment successful — update user profile in Supabase
        if (response.status === "success") {
          await supabase.from("profiles").upsert({
            id: user.id,
            is_pro: true,
            paystack_ref: response.reference,
            upgraded_at: new Date().toISOString(),
          });

          // Reload so app reflects pro status
          window.location.reload();
        }
        setLoading(false);
        onClose();
      },
      onClose: () => {
        setLoading(false);
      },
    });

    handler.openIframe();
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@200;300&display=swap');

        .upgrade-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8,7,6,0.94);
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
          max-width: 380px;
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

        .upgrade-icon {
          font-size: 1.4rem;
          opacity: 0.5;
        }

        .upgrade-reason {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 200;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c4b99a;
        }

        .upgrade-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 2rem;
          color: #e8dfc8;
          letter-spacing: 0.1em;
          line-height: 1.2;
        }

        .upgrade-divider {
          width: 24px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #3a352d, transparent);
        }

        .upgrade-perks {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          width: 100%;
        }

        .upgrade-perk {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.98rem;
          color: #c4b99a;
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
          background: #c4a97d;
          flex-shrink: 0;
        }

        .upgrade-price {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 200;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8a7a68;
        }

        .upgrade-price strong {
          color: #c4a97d;
          font-weight: 300;
        }

        .upgrade-btn {
          width: 100%;
          background: transparent;
          border: 1px solid #6b5d48;
          color: #e8dfc8;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .upgrade-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(196,169,125,0.08);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .upgrade-btn:hover { border-color: #c4a97d; }
        .upgrade-btn:hover::before { transform: scaleX(1); }
        .upgrade-btn:disabled { opacity: 0.3; cursor: default; pointer-events: none; }

        .upgrade-close {
          background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem; font-weight: 200;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #3a352d; padding: 0;
          transition: color 0.3s ease;
        }

        .upgrade-close:hover { color: #6b5d48; }
      `}</style>

      <div
        className="upgrade-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="upgrade-modal">
          <span className="upgrade-icon">◇</span>
          <span className="upgrade-reason">{reasonText}</span>
          <h2 className="upgrade-title">unsent pro</h2>
          <div className="upgrade-divider" />

          <div className="upgrade-perks">
            <div className="upgrade-perk">
              <div className="upgrade-perk-dot" />
              unlimited entries
            </div>
            <div className="upgrade-perk">
              <div className="upgrade-perk-dot" />
              time capsules
            </div>
            <div className="upgrade-perk">
              <div className="upgrade-perk-dot" />
              mood timeline
            </div>
            <div className="upgrade-perk">
              <div className="upgrade-perk-dot" />
              anniversaries
            </div>
            <div className="upgrade-perk">
              <div className="upgrade-perk-dot" />
              export to pdf
            </div>
          </div>

          <p className="upgrade-price">
            <strong>$4</strong> / month
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
