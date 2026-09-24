import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"student" });
  const [error, setError] = useState("");

  const submit = async e => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand center"><span className="brand-mark">T</span> TaskFlow</div>
        <h1>Create account</h1>
        <p className="muted">Choose your role to get started.</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
          <label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
          <label>Password<input type="password" minLength="6" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
          <label>Role<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="student">Student</option><option value="professor">Professor</option></select></label>
          <button className="primary full"><UserPlus size={18}/> Create account</button>
        </form>
        <p className="switch">Already registered? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
