import express from "express";
import {
  createAssignment, getAssignments, getAssignment,
  updateAssignment, deleteAssignment
} from "../controllers/assignmentController.js";
import { protect, professorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAssignments);
router.get("/:id", protect, getAssignment);
router.post("/", protect, professorOnly, createAssignment);
router.put("/:id", protect, professorOnly, updateAssignment);
router.delete("/:id", protect, professorOnly, deleteAssignment);

export default router;
