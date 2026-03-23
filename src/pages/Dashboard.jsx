import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import NewEntry from "../entries/NewEntry";
import { useLang } from "../lib/LangContext";
import Onboarding from "../components/Onboarding";

export default function Dashboard() {
  const [streak, setStreak] = useState(0);
  const { t } = useLang();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [justUpgraded, setJustUpgraded] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem("unsent_onboarded");
    if (!onboarded) setShowOnboarding(true);
  }, []);

  // Handle post-payment redirect
  useEffect(() => {
    const upgraded = searchParams.get("upgraded");
    if (upgraded === "true") {
      const markPro = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;
        await supabase.from("profiles").upsert({
          id: session.user.id,
          is_pro: true,
          upgraded_at: new Date().toISOString(),
        });
        setJustUpgraded(true);
        setSearchParams({});
        setTimeout(() => setJustUpgraded(false), 4000);
      };
      markPro();
    }
  }, []);

  useEffect(() => {
    const calcStreak = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("entries")
        .select("created_at")
        .eq("user_id", session.user.id)
        .eq("is_reply", false)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) return;

      const days = [
        ...new Set(
          data.map((e) => new Date(e.created_at).toLocaleDateString("en-CA")),
        ),
      ].sort((a, b) => b.localeCompare(a));

      const today = new Date().toLocaleDateString("en-CA");
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString(
        "en-CA",
      );

      if (days[0] !== today && days[0] !== yesterday) return;

      let count = 1;
      for (let i = 1; i < days.length; i++) {
        const prev = new Date(days[i - 1]);
        const curr = new Date(days[i]);
        const diff = (prev - curr) / 86400000;
        if (diff === 1) count++;
        else break;
      }

      if (count >= 2) setStreak(count);
    };
    calcStreak();
  }, []);

  const streakText = (n) => {
    if (n === 2) return t.streak_2;
    if (n === 3) return t.streak_3;
    if (n >= 7) return t.streak_n(n);
    return t.streak_default(n);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Jost:wght@200;300&display=swap');

        .dashboard {
          min-height: calc(100vh - 73px);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 2rem;
        }

        .dashboard-greeting {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 0.88rem;
          color: #2e2a24;
          letter-spacing: 0.1em;
          text-align: center;
          margin-bottom: 0.8rem;
          animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.1s;
        }

        .dashboard-streak {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 200;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2e2a24;
          text-align: center;
          margin-bottom: 2.4rem;
          animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.25s;
        }

        .dashboard-streak-dot {
          display: inline-block;
          width: 4px; height: 4px;
          background: #c4a97d;
          border-radius: 50%;
          margin-right: 0.5rem;
          vertical-align: middle;
          opacity: 0.7;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {showOnboarding && <Onboarding onDone={() => setShowOnboarding(false)} />}

      <div className="dashboard">
        {justUpgraded && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "1rem",
              color: "#c4a97d",
              letterSpacing: "0.06em",
              textAlign: "center",
              marginBottom: "1.4rem",
              animation: "fadeUp 0.6s ease both",
            }}
          >
            welcome to unsent pro.
          </p>
        )}
        <p className="dashboard-greeting">who is this for?</p>
        {streak >= 2 && (
          <p className="dashboard-streak">
            <span className="dashboard-streak-dot" />
            {streakText(streak)}
          </p>
        )}
        <NewEntry />
      </div>
    </>
  );
}
