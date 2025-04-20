import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JobForm = () => {
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
 const navigate = useNavigate()
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobs.push(form); // Add the new job to the list
    localStorage.setItem("jobs", JSON.stringify(jobs)); 
  

    setForm({
      title: "",
      location: "",
      jobType: "",
      education: "",
      skills: "",
      experience: "",
      description: "",
      status: "Active",
    });
  };

  return (
    <>
      <h2 className="text-2xl font-light text-gray-800 mb-6 text-center">
        Create Job
      </h2>
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-md rounded-md max-w-xl mx-auto space-y-4"
      >
        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border-1 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <input
          name="jobType"
          placeholder="Job Type"
          value={form.jobType}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <input
          name="education"
          placeholder="Education"
          value={form.education}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <input
          name="skills"
          placeholder="Skills"
          value={form.skills}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <input
          name="experience"
          placeholder="Experience"
          value={form.experience}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </select>
        <button onClick={()=>{navigate("/")}}
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
        >
          Post Job
        </button>
      </form>
    </>
  );
};

export default JobForm;
