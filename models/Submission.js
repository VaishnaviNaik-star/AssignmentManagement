import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
  content: { type: String, required: true, trim: true },
  submittedAt: { type: Date, required: true },
  status: { type: String, enum: ["On Time", "Late"], required: true }
}, { timestamps: true });

submissionSchema.index({ student: 1, assignment: 1 }, { unique: true });

export default mongoose.model("Submission", submissionSchema);
