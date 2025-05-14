import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../Controllers/job.Controllers.js";
import authenticateToken from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken(["employer"]), createJob); // Protected: Create job
router.get("/", getJobs); // Public: Get all jobs
router.get("/:id", getJobById); // Public: Get job by ID
router.put("/:id", authenticateToken(["employer"]), updateJob); // Protected: Update job
router.delete("/:id", authenticateToken(["employer"]), deleteJob); // Protected: Delete job

export default router;
