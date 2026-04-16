import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          background-color: #111214;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="auth-root">
        <Outlet />
      </div>
    </>
  );
}
