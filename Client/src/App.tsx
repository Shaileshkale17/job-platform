import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStore } from "./store";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import JobPost from "./pages/JobPost";

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}>
      <BrowserRouter>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
              <Route
                path="/employer/dashboard"
                element={<EmployerDashboard />}
              />
              <Route path="/employer/job-post" element={<JobPost />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["jobseeker"]} />}>
              <Route
                path="/jobseeker/dashboard"
                element={<JobSeekerDashboard />}
              />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
