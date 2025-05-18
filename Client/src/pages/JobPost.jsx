import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import axios from "axios";

const JobPost = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    category: "",
    easy: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        requirements: formData.requirements
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/job/`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //   console.log("response.data", response.data.job);
      alert("Job posted successfully!");
      navigate(`/jobs/${response.data.job._id}`);
    } catch (err) {
      console.error("Job post error:", err);
      alert("Failed to post job");
    }
  };

  return (
    <div
      className={`max-w-3xl mx-auto p-6 rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}>
      <h2 className="text-2xl font-bold mb-6">Post a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
        />
        <input
          className="w-full p-2 border rounded"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company Name"
          required
        />
        <input
          className="w-full p-2 border rounded"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <select
          className="w-full p-2 border rounded"
          name="type"
          value={formData.type}
          onChange={handleChange}>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
        <input
          className="w-full p-2 border rounded"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary (e.g., $125,000/year)"
          required
        />
        <textarea
          className="w-full p-2 border rounded"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Job Description"
          rows={5}
          required
        />
        <textarea
          className="w-full p-2 border rounded"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="Requirements (comma-separated)"
          rows={3}
          required
        />
        <input
          className="w-full p-2 border rounded"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category (e.g., Cybersecurity)"
          required
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="easy"
            checked={formData.easy}
            onChange={handleChange}
          />
          <span>Easy Apply</span>
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default JobPost;
