import express from "express";
import {
  createApplication,
  getAllApplications,
  getMyApplications,
  updateApplicationStatus,
} from "../Controllers/Applications.controllers.js";
import authenticateToken from "../Middlewares/auth.middleware.js";
import upload from "../Middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken(["jobseeker"]),
  upload.single("resume"),
  createApplication
);

router.get("/", authenticateToken(["employer"]), getAllApplications);
router.get("/me", authenticateToken(["jobseeker"]), getMyApplications);
router.put("/:id", authenticateToken(["employer"]), updateApplicationStatus);

export default router;
