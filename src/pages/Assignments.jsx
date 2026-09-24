import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight, Trash2, Pencil } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

export default function Assignments() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const load = () => api.get("/assignments").then(r=>setItems(r.data));

  useEffect(()=>{ load().catch(console.error); },[]);

  const remove = async id => {
    if (!confirm("Delete this assignment?")) return;
    await api.delete(`/assignments/${id}`);
    load();
  };

  return (
    <section>
      <div className="page-heading"><div><p className="eyebrow">WORKSPACE</p><h1>Assignments</h1></div>{user.role==="professor" && <Link className="primary" to="/assignments/new"><Plus size={18}/> Create assignment</Link>}</div>
      <div className="assignment-grid">
        {items.map(a => (
          <div className="assignment-card" key={a._id}>
            <div className="card-top"><span className="subject">{a.subject}</span><StatusBadge status={a.status}/></div>
            <h3>{a.title}</h3><p>{a.description || "No description provided."}</p>
            <small>Deadline: {new Date(a.deadline).toLocaleString()}</small>
            <div className="card-actions">
              <Link to={`/assignments/${a._id}`}>View <ArrowRight size={16}/></Link>
              {user.role==="professor" && <><Link to={`/assignments/${a._id}/edit`}><Pencil size={16}/> Edit</Link><button onClick={()=>remove(a._id)} className="danger-link"><Trash2 size={16}/> Delete</button></>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
