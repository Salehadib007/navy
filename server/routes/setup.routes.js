import express from "express";
import {
  getSetup,
  addSetupItem,
  removeSetupItem,
} from "../controllers/setup.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import accessMiddleware from "../middlewares/access.middleware.js";

const router = express.Router();

router.get("/", getSetup);

router.post(
  "/add",
  authMiddleware,
  // accessMiddleware("Setup.Manage"),
  addSetupItem,
);

router.post(
  "/remove",
  authMiddleware,
  // accessMiddleware("Setup.Manage"),
  removeSetupItem,
);

export default router;
