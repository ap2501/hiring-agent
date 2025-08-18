import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ResultsFullPipeline from "../components/ResultsFullPipeline";
import { useAuth } from "../context/AuthContext";
import History from "../components/History";
import ResultSearch from "../components/ResultSearch";

// --- Helper & Sub-Components ---

const ShimmerBlock = ({ className }) => (
  <div className={`bg-gray-800/50 rounded-lg animate-pulse ${className}`}></div>
);

const SidebarSkeleton = () => (
  <aside className="fixed z-50 top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-800/50 hidden lg:flex flex-col">
    <header className="p-6 border-b border-gray-800/50">
      <div className="flex items-center gap-3">
        <ShimmerBlock className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <ShimmerBlock className="w-3/4 h-4" />
          <ShimmerBlock className="w-1/2 h-3" />
        </div>
      </div>
    </header>
    <div className="p-6 flex-grow">
      <ShimmerBlock className="w-full h-24 rounded-2xl" />
    </div>
    <footer className="p-6 border-t border-gray-800/50">
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-2">
          <ShimmerBlock className="w-1/2 h-4" />
          <ShimmerBlock className="w-3/4 h-3" />
        </div>
        <ShimmerBlock className="w-8 h-8 rounded-lg" />
      </div>
    </footer>
  </aside>
);

const HistoryPageSkeleton = () => (
  <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
    <SidebarSkeleton />
    <main className="lg:ml-80">
      <div className="max-w-4xl mx-auto p-6 lg:p-12">
        <ShimmerBlock className="w-2/3 h-10 mb-8" />
        <ShimmerBlock className="w-full h-72 rounded-2xl" />
      </div>
    </main>
  </div>
);

const Sidebar = ({
  isSidePanelOpen,
  setIsSidePanelOpen,
  user,
  onLogout,
  onHistoryClick,
}) => (
  <aside
    className={`fixed z-50 top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-800/50 transform transition-transform duration-300 ease-in-out ${
      isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
    } lg:translate-x-0 flex flex-col`}
  >
    <header className="p-6 border-b border-gray-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Hiring Agent</h1>
            <p className="text-xs text-gray-400">
              Your AI Recruiting Assistant
            </p>
          </div>
        </div>
        <button
          className="lg:hidden p-2"
          onClick={() => setIsSidePanelOpen(false)}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </header>

    <div className="p-6 flex-grow overflow-y-auto">
      <History onHistoryClick={onHistoryClick} />
    </div>

    <footer className="p-6 border-t border-gray-800/50 space-y-4">
      {user ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Logout"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>Loading profile...</p>
        </div>
      )}
    </footer>
  </aside>
);

// --- Main Page Component ---

const HistoryPage = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const token = user?.token || localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/history/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistoryData(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
        setHistoryData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id, user]);

  const handleLogout = () => {
    logout();
  };

  const handleHistoryClick = (historyItem) => {
    navigate(`/history/${historyItem._id}`);
  };

  if (loading) return <HistoryPageSkeleton />;
  if (!historyData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            History Not Found
          </h2>
          <p className="text-gray-400">
            We couldn't find the search you were looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {isSidePanelOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidePanelOpen(false)}
        />
      )}
      <Sidebar
        isSidePanelOpen={isSidePanelOpen}
        setIsSidePanelOpen={setIsSidePanelOpen}
        user={user}
        onLogout={handleLogout}
        onHistoryClick={handleHistoryClick}
      />
      <main className="lg:ml-80">
        <div className="max-w-4xl mx-auto p-6 lg:p-12">
          <button
            className="lg:hidden mb-8 bg-gray-900/80 hover:bg-gray-800 px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
            onClick={() => setIsSidePanelOpen(true)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="font-medium">Menu</span>
          </button>

          {/* --- ✅ START: NAVIGATION BUTTONS ADDED HERE --- */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/70 hover:bg-gray-700/70 rounded-lg transition-colors text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors text-sm font-medium text-emerald-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              <span>New Search</span>
            </button>
          </div>
          {/* --- ✅ END: NAVIGATION BUTTONS --- */}


          <header className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight">
              Search Result:{" "}
              <span className="text-emerald-400">{historyData.title}</span>
            </h1>
            <p className="text-gray-400">
              {new Date(historyData.timestamp).toLocaleString()} - (
              {historyData.mode === "full" ? "Full Pipeline" : "Quick Search"})
            </p>
          </header>

          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                Original Job Description
              </h2>
              <div className="relative">
                <textarea
                  readOnly
                  value={historyData.jd}
                  className="w-full h-72 p-6 bg-gray-900/70 border border-gray-800/50 rounded-2xl resize-none focus:outline-none text-gray-300 placeholder-gray-500 text-base leading-relaxed"
                />
              </div>
            </section>

            <section>
                <ResultsFullPipeline data={historyData.results} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
