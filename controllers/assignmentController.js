import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import { getMissingStatus } from "../utils/status.js";

export const createAssignment = async (req, res) => {
  try {
    const { title, subject, description, deadline } = req.body;

    if (!title || !subject || !deadline) {
      return res.status(400).json({ message: "Title, subject and deadline are required" });
    }

    const deadlineDate = new Date(deadline);
    if (Number.isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
      return res.status(400).json({ message: "Deadline must be a valid future date and time" });
    }

    const assignment = await Assignment.create({
      title, subject, description, deadline: deadlineDate, createdBy: req.user.id
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("createdBy", "name email").sort({ deadline: 1 });
    const submissions = await Submission.find({ student: req.user.id });

    const result = assignments.map(a => {
      const submission = submissions.find(s => s.assignment.toString() === a._id.toString());
      return {
        ...a.toObject(),
        mySubmission: submission || null,
        status: getMissingStatus(a.deadline, submission)
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate("createdBy", "name email");
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const submission = await Submission.findOne({
      assignment: assignment._id,
      student: req.user.id
    });

    res.json({
      ...assignment.toObject(),
      mySubmission: submission,
      status: getMissingStatus(assignment.deadline, submission)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const { title, subject, description, deadline } = req.body;
    const newDeadline = new Date(deadline);

    if (!title || !subject || !deadline || Number.isNaN(newDeadline.getTime()) || newDeadline <= new Date()) {
      return res.status(400).json({ message: "Valid title, subject and future deadline are required" });
    }

    assignment.title = title;
    assignment.subject = subject;
    assignment.description = description || "";
    assignment.deadline = newDeadline;

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    await Submission.deleteMany({ assignment: assignment._id });
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
