import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async e => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand center"><span className="brand-mark">T</span> TaskFlow</div>
        <h1>Welcome back</h1>
        <p className="muted">Manage assignments and submissions in one place.</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></label>
          <label>Password<input type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})}/></label>
          <button className="primary full"><LogIn size={18}/> Sign in</button>
        </form>
        <p className="switch">New here? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
