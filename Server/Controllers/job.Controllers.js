import Job from "../model/Job.model.js";

export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      category,
      easy,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      category,
      easy,
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    next(err);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job updated", updatedJob });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted" });
  } catch (err) {
    next(err);
  }
};
