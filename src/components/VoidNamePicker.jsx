import { useState } from "react";
import { supabase } from "../lib/supabase";

const ADJECTIVES = [
  "hollow",
  "quiet",
  "fading",
  "still",
  "lost",
  "broken",
  "distant",
  "empty",
  "aching",
  "restless",
  "wandering",
  "silent",
  "fragile",
  "heavy",
  "numb",
  "searching",
  "weary",
  "gentle",
  "bare",
  "tender",
  "dim",
  "pale",
  "raw",
  "open",
  "tired",
  "soft",
  "dark",
  "cold",
  "warm",
  "lone",
];

const NOUNS = [
  "echo",
  "storm",
  "ember",
  "water",
  "tide",
  "shadow",
  "flame",
  "river",
  "window",
  "letter",
  "night",
  "dawn",
  "fog",
  "smoke",
  "rain",
  "moon",
  "thread",
  "voice",
  "pulse",
  "breath",
  "shore",
  "road",
  "door",
  "light",
  "glass",
  "stone",
  "wing",
  "wave",
  "hour",
  "dream",
];

function generateNames(count = 5) {
  const names = new Set();
  while (names.size < count) {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    names.add(`${adj} ${noun}`);
  }
  return [...names];
}

export default function VoidNamePicker({ userId, onDone }) {
  const [options, setOptions] = useState(() => generateNames(5));
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, void_name: selected });

    if (error) {
      if (error.message.includes("unique")) {
        setError(
          "that name was just taken. please pick another or regenerate.",
        );
        setOptions(generateNames(5));
        setSelected(null);
      } else {
        setError("something went wrong. try again.");
      }
      setLoading(false);
      return;
    }

    onDone(selected);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');

        .vname-root {
          min-height: 100vh;
          background: #111214;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .vname-title {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.2rem;
          color: #2e3138;
          letter-spacing: 0.06em;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .vname-sub {
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem;
          font-weight: 200;
          letter-spacing: 0.22em;
          text-transform: lowercase;
          color: #1e2026;
          text-align: center;
          margin-bottom: 2.4rem;
        }

        .vname-options {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          width: 100%;
          max-width: 300px;
          margin-bottom: 1.6rem;
        }

        .vname-option {
          background: transparent;
          border: none;
          border-bottom: 1px solid #1c1e22;
          padding: 0.7rem 0;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.05rem;
          color: #2a2d34;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
          letter-spacing: 0.04em;
          position: relative;
        }

        .vname-option::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          height: 1px; width: 0%;
          background: #3a3d44;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vname-option:hover { color: #3a3d44; }
        .vname-option:hover::after { width: 100%; }
        .vname-option.selected { color: #6b7080; }
        .vname-option.selected::after { width: 100%; }

        .vname-actions {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .vname-regen {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.54rem; font-weight: 300;
          letter-spacing: 0.2em; text-transform: lowercase;
          color: #1e2026; padding: 0;
          transition: color 0.3s ease;
        }

        .vname-regen:hover { color: #3a3d44; }

        .vname-confirm {
          background: none; border: none;
          border-bottom: 1px solid #1e2026;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.58rem; font-weight: 300;
          letter-spacing: 0.22em; text-transform: lowercase;
          color: #2e3138; padding: 0.2rem 0;
          transition: all 0.3s ease;
        }

        .vname-confirm:hover { color: #6b7080; border-color: #3a3d44; }
        .vname-confirm:disabled { opacity: 0.15; cursor: default; pointer-events: none; }

        .vname-error {
          margin-top: 1rem;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 0.82rem;
          color: #7a4a4a;
          text-align: center;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="vname-root">
        <p className="vname-title">you're entering the void.</p>
        <p className="vname-sub">choose your name. it stays with you.</p>

        <div className="vname-options">
          {options.map((name) => (
            <button
              key={name}
              className={`vname-option ${selected === name ? "selected" : ""}`}
              onClick={() => setSelected(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="vname-actions">
          <button
            className="vname-regen"
            onClick={() => {
              setOptions(generateNames(5));
              setSelected(null);
            }}
          >
            generate new names
          </button>
          <button
            className="vname-confirm"
            onClick={handleConfirm}
            disabled={!selected || loading}
          >
            {loading ? "saving…" : "this is me"}
          </button>
        </div>

        {error && <p className="vname-error">{error}</p>}
      </div>
    </>
  );
}
