import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function AssignmentForm() {
  const { id } = useParams();
  const edit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({title:"",subject:"",description:"",deadline:""});
  const [error,setError] = useState("");

  useEffect(() => {
    if (edit) api.get(`/assignments/${id}`).then(({data}) => setForm({
      title:data.title, subject:data.subject, description:data.description || "",
      deadline:new Date(data.deadline).toISOString().slice(0,16)
    })).catch(e=>setError(e.response?.data?.message || "Unable to load"));
  }, [edit,id]);

  const submit = async e => {
    e.preventDefault();
    try {
      if (edit) await api.put(`/assignments/${id}`, form);
      else await api.post("/assignments", form);
      navigate("/assignments");
    } catch (e) {
      setError(e.response?.data?.message || "Unable to save assignment");
    }
  };

  return <section className="form-page"><div className="form-header"><p className="eyebrow">PROFESSOR</p><h1>{edit ? "Edit assignment" : "Create assignment"}</h1><p className="muted">Set a clear deadline. The server handles submission timing.</p></div>
    {error && <div className="error">{error}</div>}
    <form className="panel form-grid" onSubmit={submit}>
      <label>Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
      <label>Subject<input required value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></label>
      <label className="full-row">Description<textarea rows="6" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
      <label>Deadline<input type="datetime-local" required value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})}/></label>
      <div className="form-buttons"><button type="button" className="secondary" onClick={()=>navigate("/assignments")}>Cancel</button><button className="primary">{edit ? "Save changes" : "Create assignment"}</button></div>
    </form>
  </section>;
}
