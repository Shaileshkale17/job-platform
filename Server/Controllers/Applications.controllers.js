import cloudinary from "../config/cloudinary.js";
import Application from "../model/Applications.model.js";
import Job from "../model/Job.model.js";

export const createApplication = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    let resumeUrl = "";

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // for PDFs, DOCs, etc.
          folder: "resumes",
          public_id: `${req.user.id}_${Date.now()}`,
        },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Upload failed", error });
          }

          const application = await Application.create({
            jobId,
            userId: req.user.id,
            coverLetter,
            resume: result.secure_url,
          });

          return res.status(201).json({ success: true, data: application });
        }
      );

      uploaded.end(req.file.buffer); // send file buffer to Cloudinary
    } else {
      return res.status(400).json({ message: "Resume file is required." });
    }
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

    const activeJobs = jobs.filter((job) => job.isActive).length;

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
        monthlyJobPostings,
        categoryData,
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

export const getApplicationActivity = async (req, res) => {
  try {
    const sixWeeksAgo = moment().subtract(5, "weeks").startOf("week").toDate();

    const apps = await Application.find({
      userId: req.user.id,
      createdAt: { $gte: sixWeeksAgo },
    });

    const activity = Array.from({ length: 6 }, (_, i) => ({
      week: `Week ${i + 1}`,
      applications: 0,
    }));

    apps.forEach((app) => {
      const weekIndex = Math.floor(
        moment(app.createdAt).diff(sixWeeksAgo, "days") / 7
      );
      if (weekIndex >= 0 && weekIndex < 6) {
        activity[weekIndex].applications += 1;
      }
    });

    res.status(200).json({ success: true, data: activity });
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
