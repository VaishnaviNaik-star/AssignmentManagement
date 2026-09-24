import express from "express";
import { protect, studentOnly, professorOnly } from "../middleware/authMiddleware.js";
import { submitAssignment, getAssignmentSubmissions } from "../controllers/submissionController.js";

const router = express.Router();

router.post("/:assignmentId", protect, studentOnly, submitAssignment);
router.get("/assignment/:assignmentId", protect, professorOnly, getAssignmentSubmissions);

export default router;
