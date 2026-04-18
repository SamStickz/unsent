// LogoutButton.jsx
import { supabase } from "../lib/supabase";

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      <style>{`
        .logout-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.56rem; font-weight: 300;
          letter-spacing: 0.2em; text-transform: lowercase;
          color: #4a4f5a; padding: 0;
          transition: color 0.3s ease; position: relative;
        }
        .logout-btn::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0%; height: 1px; background: #6a6f7a; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .logout-btn:hover { color: #8a8f9a; }
        .logout-btn:hover::after { width: 100%; }
      `}</style>
      <button className="logout-btn" onClick={handleLogout}>
        leave
      </button>
    </>
  );
}
