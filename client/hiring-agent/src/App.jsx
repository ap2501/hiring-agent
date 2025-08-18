import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from './context/AuthContext';
import LoggedOutHome from "./components/LoggedOutHome";
import Home from "./pages/Home";
import HistoryPage from "./pages/HistoryPage"; // New page for specific history
import LoadingState from './components/LoadingState';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Router>
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/history/:id" element={<HistoryPage />} />
          </>
        ) : (
          <Route path="*" element={<LoggedOutHome />} />
        )}
      </Routes>
    </Router>
  );
}
