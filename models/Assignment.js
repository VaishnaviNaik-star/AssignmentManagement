import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  deadline: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);
