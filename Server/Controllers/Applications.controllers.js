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
