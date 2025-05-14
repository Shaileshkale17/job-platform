import Application from "../model/Applications.model.js";
import Job from "../model/Job.model.js";

export const createApplication = async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const application = await Application.create({
      jobId,
      userId: req.user.id,
      coverLetter,
      resume,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate("jobId userId");
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// models/Job.js

export const getAllApplicationsindex = async (req, res) => {
  try {
    const applications = await Application.find().populate("jobId userId");
    const jobs = await Job.find();
    const monthlyJobPostings = jobs.reduce((acc, job) => {
      const month = new Date(job.createdAt).toLocaleString("default", {
        month: "short",
      });
      if (!acc[month]) acc[month] = 0;
      acc[month]++;
      return acc;
    }, {});

    // Jobs by Category
    const categoryData = jobs.reduce((acc, job) => {
      if (!acc[job.category]) acc[job.category] = 0;
      acc[job.category]++;
      return acc;
    }, {});

    // Calculate Active Jobs
    const activeJobs = jobs.filter((job) => job.isActive).length; // assuming 'isActive' field

    // Calculate Applications by Status
    const totalApplications = applications.length;
    const pendingReview = applications.filter(
      (app) => app.status === "pending"
    ).length;
    const hired = applications.filter(
      (app) => app.status === "accepted"
    ).length;

    res.status(200).json({
      success: true,
      data: {
        monthlyJobPostings, // { Jan: 4, Feb: 6, ... }
        categoryData, // { Development: 35%, Design: 25%, ... }
        activeJobs,
        totalApplications,
        pendingReview,
        hired,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id }).populate(
      "jobId"
    );
    res.status(200).json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const app = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!app) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({ success: true, data: app });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
