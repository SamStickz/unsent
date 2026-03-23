import { Outlet, NavLink } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function AppLayout() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@200;300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background-color: #0e0d0b; }

        .app-root {
          min-height: 100vh;
          background-color: #0e0d0b;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -5%, rgba(180,155,110,0.06) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          font-family: 'Jost', sans-serif;
        }

        .app-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(14,13,11,0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #111009;
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
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1rem;
          color: #8a7a68;
          letter-spacing: 0.22em;
          text-transform: lowercase;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .app-brand:hover { color: #c4b99a; }

        .app-nav {
          display: flex;
          align-items: center;
          gap: 1.8rem;
        }

        .app-nav-link {
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #4a4030;
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
          background: #c4a97d;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .app-nav-link:hover { color: #8a7a68; }
        .app-nav-link.active { color: #c4a97d; }
        .app-nav-link.active::after,
        .app-nav-link:hover::after { width: 100%; }

        .app-main {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          padding: 0 2rem;
          animation: pageFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes pageFade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="app-root">
        <header className="app-header">
          <div className="app-header-inner">
            <NavLink to="/app" className="app-brand">unsent</NavLink>
            <nav className="app-nav">
              <NavLink to="/app" end className={({ isActive }) => `app-nav-link ${isActive ? "active" : ""}`}>
                write
              </NavLink>
              <NavLink to="/app/entries" className={({ isActive }) => `app-nav-link ${isActive ? "active" : ""}`}>
                kept
              </NavLink>
              <LogoutButton />
            </nav>
          </div>
        </header>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}