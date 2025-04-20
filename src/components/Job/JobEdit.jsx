import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function JobEdit() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    jobType: "",
    education: "",
    skills: "",
    experience: "",
    description: "",
    status: "Active",
  });

  const [jobIndex, setJobIndex] = useState(null);

  useEffect(() => {
    const jobData = JSON.parse(localStorage.getItem("jobToEdit"));
    if (jobData) {
      setForm(jobData.job); // Prefill Job data 
      setJobIndex(jobData.index);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobs[jobIndex] = form;
    localStorage.setItem("jobs", JSON.stringify(jobs));
    localStorage.removeItem("jobToEdit");
    navigate("/");
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="p-6 mt-10 bg-white shadow-md rounded-md max-w-xl mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold text-center">Edit Job</h2>
      <input
        name="title"
        placeholder="Job Title"
        value={form.title}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="jobType"
        placeholder="Job Type"
        value={form.jobType}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="education"
        placeholder="Education"
        value={form.education}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="skills"
        placeholder="Skills"
        value={form.skills}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="experience"
        placeholder="Experience"
        value={form.experience}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <textarea
        name="description"
        placeholder="Job Description"
        value={form.description}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="Active">Active</option>
        <option value="Closed">Closed</option>
      </select>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Update Job
      </button>
    </form>
  );
}

export default JobEdit;
