import { useState } from "react";
import LoggedOutHome from "./components/LoggedOutHome";
import Home from "./pages/Home";

export default function App() {
  
  // For now, hardcode login state (later connect to Node auth)
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {loggedIn ? <Home /> : <LoggedOutHome />}
    </div>
  );
}
