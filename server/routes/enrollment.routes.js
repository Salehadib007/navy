import express from "express";
import {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} from "../controllers/enrollment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create
router.post("/", authMiddleware, createEnrollment);

// Get all
router.get("/", authMiddleware, getEnrollments);

// Get single
router.get("/:id", authMiddleware, getEnrollmentById);

router.put("/:id", authMiddleware, updateEnrollment); // update
router.delete("/:id", authMiddleware, deleteEnrollment); // delete
export default router;
