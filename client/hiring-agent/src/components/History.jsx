import React, { useState, useEffect } from "react";
import axios from "axios";
import { deleteHistory } from "../services/appService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// --- Helper & Sub-Components ---

const ShimmerBlock = ({ className }) => (
  <div className={`bg-gray-800/50 rounded-lg animate-pulse ${className}`}></div>
);

const HistorySkeleton = () => (
  <div className="space-y-2">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="p-3 bg-gray-900/40 rounded-lg">
        <ShimmerBlock className="w-3-4 h-4" />
      </div>
    ))}
  </div>
);

// --- Main Component ---

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ... (useEffect and other functions remain the same) ...
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/history`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleDelete = async (id) => {
    const originalHistory = [...history];
    setHistory(history.filter((item) => item._id !== id));
    try {
      await deleteHistory(id, user.token);
    } catch (err) {
      console.error("Delete failed", err);
      setHistory(originalHistory); // Revert on failure
    }
  };

  const handleClick = (id) => {
    navigate(`/history/${id}`);
  };


  if (loading) {
    return <HistorySkeleton />;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-white px-1">History</h2>
      {history.length === 0 ? (
        <div className="text-center py-8 px-4 bg-gray-900/40 rounded-lg border border-gray-700/50">
          <p className="text-sm text-gray-500">
            Your past searches will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item._id}
              // --- THIS IS THE ONLY LINE THAT CHANGED ---
              className="group relative bg-gray-900/50 rounded-lg border border-gray-700/50 transition-all hover:border-emerald-500/60 hover:bg-gray-800/60 cursor-pointer"
              onClick={() => handleClick(item._id)}
            >
              <div className="p-3 flex items-center justify-between">
                <p
                  className="text-sm text-gray-200 truncate pr-8"
                  title={item.title}
                >
                  {item.title}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    handleDelete(item._id);
                  }}
                  className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 rounded-md text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-opacity"
                  title="Delete"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;