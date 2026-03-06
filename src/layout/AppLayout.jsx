import { Outlet, NavLink } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function AppLayout() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@200;300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .app-root {
          min-height: 100vh;
          background-color: #0e0d0b;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -5%, rgba(180,155,110,0.06) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          font-family: 'Jost', sans-serif;
        }

        .app-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.4rem 2rem 0;
          border-bottom: 1px solid #1a1814;
        }

        .app-brand {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.4rem;
          color: #e8dfc8;
          letter-spacing: 0.18em;
          text-transform: lowercase;
          text-decoration: none;
          margin-bottom: 1rem;
        }

        .app-nav {
          display: flex;
          align-items: center;
          gap: 0;
          width: 100%;
          justify-content: center;
        }

        .app-nav-link {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7a6f5e;
          text-decoration: none;
          transition: color 0.3s ease;
          position: relative;
          padding: 0.6rem 1.4rem;
        }

        .app-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0%;
          height: 1px;
          background: #c4a97d;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .app-nav-link:hover,
        .app-nav-link.active {
          color: #c4a97d;
        }

        .app-nav-link.active::after,
        .app-nav-link:hover::after {
          width: 60%;
        }

        .app-nav-sep {
          width: 1px;
          height: 10px;
          background: #1e1c18;
          flex-shrink: 0;
        }

        .app-nav-leave {
          padding: 0.6rem 1.4rem;
        }

        .app-main {
          width: 100%;
        }
      `}</style>

      <div className="app-root">
        <header className="app-header">
          <NavLink to="/app" className="app-brand">
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
            <div className="app-nav-sep" />
            <NavLink
              to="/app/entries"
              className={({ isActive }) =>
                `app-nav-link ${isActive ? "active" : ""}`
              }
            >
              kept
            </NavLink>
            <div className="app-nav-sep" />
            <div className="app-nav-leave">
              <LogoutButton />
            </div>
          </nav>
        </header>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
