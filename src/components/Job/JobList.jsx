import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(storedJobs);
  }, []);

  const handleEdit = (job, index) => {
    localStorage.setItem("jobToEdit", JSON.stringify({ job, index }));
    navigate("/jobedit");
  };

  return (
    <div className="p-6 mt-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Job Listings
      </h2>

      {jobs.length === 0 ? (
        <p className="text-gray-600 text-center">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-5 hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-green-700">
                  {job.title}
                </h3>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    job.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{job.location}</p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Job Type:</strong> {job.jobType}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Education:</strong> {job.education}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Skills:</strong> {job.skills}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Experience:</strong> {job.experience} Years
              </p>
              <p className="text-sm text-gray-700 mt-2 truncate">
                {job.description}
              </p>

              <button
                onClick={() => handleEdit(job, i)}
                className="mt-4 text-sm px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
              >
                Edit Job
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
