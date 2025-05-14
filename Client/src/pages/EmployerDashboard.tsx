import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useStore } from "../store";
import { dummyJobs } from "../data";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function EmployerDashboard() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const [applicationsData, setApplicationsData] = useState([]);
  const [applicationsSummary, setApplicationsSummary] = useState({
    monthlyJobPostings: {},
    categoryData: {},
    activeJobs: 0,
    totalApplications: 0,
    pendingReview: 0,
    hired: 0,
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/application`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplicationsData(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } catch (err) {
        console.error("Fetch applications error:", err);
      }
    };

    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/application/index`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplicationsSummary(response.data.data);
      } catch (err) {
        console.error("Fetch summary error:", err);
      }
    };

    fetchApplications();
    fetchSummary();
  }, []);

  // Transform data for charts
  const monthlyData = Object.entries(
    applicationsSummary.monthlyJobPostings || {}
  ).map(([month, jobs]) => ({ month, jobs }));

  const categoryData = Object.entries(
    applicationsSummary.categoryData || {}
  ).map(([name, value]) => ({ name, value }));

  const employerJobs = dummyJobs.filter(
    (job) => job.company?.toLowerCase() === currentUser?.company?.toLowerCase()
  );

  const applications = applicationsData.filter((app) =>
    employerJobs.some((job) => job._id === app.jobId?._id)
  );

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Employer Dashboard</h1>
        <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Active Jobs"
          value={applicationsSummary?.activeJobs}
          color="blue"
        />
        <DashboardCard
          title="Total Applications"
          value={applicationsSummary?.totalApplications}
          color="green"
        />
        <DashboardCard
          title="Pending Review"
          value={applicationsSummary?.pendingReview}
          color="yellow"
        />
        <DashboardCard
          title="Hired"
          value={applicationsSummary?.hired}
          color="purple"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Monthly Job Postings">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jobs" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Jobs by Category">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value">
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md`}>
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">
          Recent Applications
        </h2>

        {applicationsData.length === 0 ? (
          <p className="p-6 text-gray-500 italic">
            No applications found for your jobs.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <tr>
                  <th className="px-6 py-3 text-left">Job Title</th>
                  <th className="px-6 py-3 text-left">Applicant</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {applicationsData.slice(0, 5).map((app) => {
                  const job = employerJobs.find(
                    (j) => j._id === app.jobId?._id
                  );
                  return (
                    <tr
                      key={app._id}
                      className={`${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      }`}>
                      <td className="px-6 py-4">{app.jobId.title || "N/A"}</td>
                      <td className="px-6 py-4">
                        {app.userId?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : app.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, value, color }) {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
  };
  const isDarkMode = useStore((state) => state.isDarkMode);
  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-6 rounded-lg shadow-md`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  const isDarkMode = useStore((state) => state.isDarkMode);
  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-6 rounded-lg shadow-md`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="h-80">{children}</div>
    </div>
  );
}

export default EmployerDashboard;
