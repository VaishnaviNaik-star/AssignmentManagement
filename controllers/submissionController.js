import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import { getSubmissionStatus } from "../utils/status.js";

export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Submission content is required" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: req.user.id
    });

    if (existing) {
      return res.status(409).json({ message: "Duplicate submission is not allowed" });
    }

    // Server timestamp. Client does not provide submittedAt.
    const submittedAt = new Date();
    const status = getSubmissionStatus(submittedAt, assignment.deadline);

    const submission = await Submission.create({
      student: req.user.id,
      assignment: assignmentId,
      content: content.trim(),
      submittedAt,
      status
    });

    res.status(201).json(submission);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate submission is not allowed" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getAssignmentSubmissions = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.assignmentId,
      createdBy: req.user.id
    });

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const submissions = await Submission.find({ assignment: assignment._id })
      .populate("student", "name email")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
