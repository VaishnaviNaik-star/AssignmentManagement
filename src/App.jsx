import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import AssignmentForm from "./pages/AssignmentForm";
import AssignmentDetails from "./pages/AssignmentDetails";

export default function App() {
  const { user } = useAuth();

  return <Routes>
    <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/assignments/new" element={<ProtectedRoute role="professor"><AssignmentForm /></ProtectedRoute>} />
      <Route path="/assignments/:id" element={<AssignmentDetails />} />
      <Route path="/assignments/:id/edit" element={<ProtectedRoute role="professor"><AssignmentForm /></ProtectedRoute>} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
