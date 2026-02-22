import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import MineSetup from "./components/MineSetup";
import EmissionDashboard from "./components/EmissionDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/minesetup" element={<MineSetup />} />
      <Route path="/dashboard" element={<EmissionDashboard />} />
    </Routes>
  );
}

export default App;