import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useLang } from "../lib/LangContext";
import { LANGUAGES } from "../lib/lang";
import LogoutButton from "../components/LogoutButton";

export default function AppLayout() {
  const { lang, chooseLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@200;300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #111214; }

        .app-root {
          min-height: 100vh;
          background-color: #111214;
          font-family: 'Inter', sans-serif;
        }

        .app-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(17,18,20,0.97);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #1c1e22;
          padding: 0 2rem;
        }

        .app-header-inner {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .app-brand {
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: 1.05rem;
          color: #5a5f6a;
          letter-spacing: 0.06em;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .app-brand:hover { color: #8a8f9a; }

        .app-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .app-nav-link {
          font-family: 'Inter', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: lowercase;
          color: #2e3138;
          text-decoration: none;
          transition: color 0.3s ease;
          position: relative;
          padding-bottom: 2px;
        }
        .app-nav-link::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 0%;
          height: 1px;
          background: #4a4f5a;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .app-nav-link:hover { color: #4a4f5a; }
        .app-nav-link.active { color: #6b7080; }
        .app-nav-link.active::after,
        .app-nav-link:hover::after { width: 100%; }

        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          z-index: 60;
        }
        .hamburger span {
          display: block;
          width: 20px;
          height: 1px;
          background: #3a3d44;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        .mobile-drawer {
          display: none;
          position: fixed;
          inset: 0;
          background: #0f1012;
          z-index: 49;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          animation: drawerFade 0.3s ease both;
        }
        .mobile-drawer.open { display: flex; }

        @keyframes drawerFade {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mobile-nav-link {
          font-family: 'IM Fell English', serif;
          font-weight: 400;
          font-size: 2.4rem;
          letter-spacing: 0.06em;
          color: #2e3138;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .mobile-nav-link:hover,
        .mobile-nav-link.active { color: #6b7080; }

        .mobile-lang {
          display: flex;
          gap: 1.4rem;
        }
        .mobile-lang button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.18em;
          text-transform: lowercase;
          padding: 0;
          transition: color 0.3s ease;
        }

        .app-main {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          padding: 0 2rem;
          animation: pageFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes pageFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .app-nav { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <div className="app-root">
        <header className="app-header">
          <div className="app-header-inner">
            <NavLink to="/app" className="app-brand" onClick={closeMenu}>
              unsent
            </NavLink>

            <nav className="app-nav">
              <NavLink
                to="/app"
                end
                className={({ isActive }) =>
                  `app-nav-link ${isActive ? "active" : ""}`
                }
              >
                write
              </NavLink>
              <NavLink
                to="/app/entries"
                className={({ isActive }) =>
                  `app-nav-link ${isActive ? "active" : ""}`
                }
              >
                kept
              </NavLink>
              <NavLink
                to="/app/void"
                className={({ isActive }) =>
                  `app-nav-link ${isActive ? "active" : ""}`
                }
              >
                void
              </NavLink>
              <div
                style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}
              >
                {Object.keys(LANGUAGES).map((code) => (
                  <button
                    key={code}
                    onClick={() => chooseLang(code)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.52rem",
                      fontWeight: 300,
                      letterSpacing: "0.16em",
                      textTransform: "lowercase",
                      color: lang === code ? "#6b7080" : "#222428",
                      padding: 0,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {code}
                  </button>
                ))}
              </div>
              <LogoutButton />
            </nav>

            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>

        <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
          <NavLink
            to="/app"
            end
            className={({ isActive }) =>
              `mobile-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            write
          </NavLink>
          <NavLink
            to="/app/entries"
            className={({ isActive }) =>
              `mobile-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            kept
          </NavLink>
          <NavLink
            to="/app/void"
            className={({ isActive }) =>
              `mobile-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            void
          </NavLink>
          <div className="mobile-lang">
            {Object.keys(LANGUAGES).map((code) => (
              <button
                key={code}
                onClick={() => {
                  chooseLang(code);
                  closeMenu();
                }}
                style={{ color: lang === code ? "#6b7080" : "#222428" }}
              >
                {code}
              </button>
            ))}
          </div>
          <LogoutButton />
        </div>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
