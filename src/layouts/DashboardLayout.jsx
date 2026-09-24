import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">T</span> TaskFlow</div>
        <nav>
          <NavLink to="/dashboard"><LayoutDashboard size={18}/> Dashboard</NavLink>
          {user.role === "professor" && (
            <NavLink to="/assignments/new"><PlusCircle size={18}/> New Assignment</NavLink>
          )}
          <NavLink to="/assignments"><BookOpen size={18}/> Assignments</NavLink>
        </nav>
        <button className="logout" onClick={signOut}><LogOut size={18}/> Logout</button>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">{user.role}</p>
            <h2>Welcome back, {user.name.split(" ")[0]}</h2>
          </div>
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
