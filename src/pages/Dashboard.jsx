import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import NewEntry from "../entries/NewEntry";

export default function Dashboard() {
  const [streak, setStreak] = useState(0);

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

      // Get unique days written (YYYY-MM-DD)
      const days = [
        ...new Set(
          data.map((e) => new Date(e.created_at).toLocaleDateString("en-CA")),
        ),
      ].sort((a, b) => b.localeCompare(a));

      const today = new Date().toLocaleDateString("en-CA");
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString(
        "en-CA",
      );

      // Streak only counts if wrote today or yesterday
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
    if (n === 2) return "you've written two days in a row.";
    if (n === 3) return "three days in a row. keep going.";
    if (n >= 7) return `${n} days. you keep coming back.`;
    return `${n} days in a row.`;
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
          font-size: 1.1rem;
          color: #a89880;
          letter-spacing: 0.1em;
          text-align: center;
          margin-bottom: 0.8rem;
          animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.1s;
        }

        .dashboard-streak {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 200;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b5d48;
          text-align: center;
          margin-bottom: 2.4rem;
          animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.25s;
        }

        .dashboard-streak-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
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

      <div className="dashboard">
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
