import NewEntry from "../entries/NewEntry";

export default function Dashboard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Jost:wght@200;300&display=swap');

        .dashboard {
          min-height: calc(100vh - 73px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
        }

        .dashboard-greeting {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1rem;
          color: #2e2b26;
          letter-spacing: 0.1em;
          text-align: center;
          margin-bottom: 2.4rem;
          animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.1s;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="dashboard">
        <p className="dashboard-greeting">who is this for?</p>
        <NewEntry />
      </div>
    </>
  );
}
