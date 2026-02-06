import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  updateUserPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", getAllUsers);
router.get("/:id", getSingleUser); // optional but very useful
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// PASSWORD UPDATE (simple)
router.patch("/:id/password", updateUserPassword);

export default router;
