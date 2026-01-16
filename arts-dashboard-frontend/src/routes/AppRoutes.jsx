import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import JudgeDashboard from "../pages/JudgeDashboard";
import ScoreboardScreen from "../pages/ScoreboardScreen";
import OnStageScreen from "../pages/OnStageScreen";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute> <AdminDashboard /> </ProtectedRoute>} />
        <Route path="/judge" element={<ProtectedRoute> <JudgeDashboard /> </ProtectedRoute>} />
        <Route path="/scoreboard" element={<ScoreboardScreen />} />
        <Route path="/onstage" element={<OnStageScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
