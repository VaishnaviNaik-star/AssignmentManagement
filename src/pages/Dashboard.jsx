import { useEffect, useState } from "react";
import { BookOpen, Clock3, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/assignments").then(r => setItems(r.data)).catch(console.error);
  }, []);

  const counts = {
    total: items.length,
    pending: items.filter(x => x.status === "Pending").length,
    onTime: items.filter(x => x.status === "On Time").length,
    late: items.filter(x => x.status === "Late").length,
    missing: items.filter(x => x.status === "Missing").length
  };

  return (
    <section>
      <div className="hero">
        <div><p className="eyebrow">OVERVIEW</p><h1>{user.role === "professor" ? "Assignment workspace" : "Your assignments"}</h1><p className="muted">Track deadlines and submissions without manual status updates.</p></div>
      </div>
      <div className="stats">
        <Stat icon={<BookOpen/>} label="Total" value={counts.total}/>
        <Stat icon={<Clock3/>} label="Pending" value={counts.pending}/>
        <Stat icon={<CheckCircle2/>} label="On Time" value={counts.onTime}/>
        <Stat icon={<AlertCircle/>} label="Late / Missing" value={counts.late + counts.missing}/>
      </div>
      <div className="section-title"><h2>Recent assignments</h2></div>
      <div className="assignment-grid">
        {items.slice(0,6).map(a => <div className="assignment-card" key={a._id}><div className="card-top"><span className="subject">{a.subject}</span><StatusBadge status={a.status}/></div><h3>{a.title}</h3><p>{a.description || "No description provided."}</p><small>Deadline: {new Date(a.deadline).toLocaleString()}</small></div>)}
      </div>
    </section>
  );
}

function Stat({icon,label,value}) {
  return <div className="stat"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}
