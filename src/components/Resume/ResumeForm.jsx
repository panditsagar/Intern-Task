import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ResumeForm = () => {
  const [candidateForm, setCandidateForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    degree: "",
    institute: "",
    skills: "",
    resume: null,
  });
  const [entryMode, setEntryMode] = useState("manual");
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidateForm({
      ...candidateForm,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCandidateForm({ ...candidateForm, resume: file });
      setResumeUploaded(true);
    }
  };

  const handleChangeResume = () => {
    setCandidateForm({ ...candidateForm, resume: null });
    setResumeUploaded(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCandidateForm({
      fullName: "",
      email: "",
      phone: "",
      degree: "",
      institute: "",
      skills: "",
      resume: null,
    });
    setResumeUploaded(false);
  };

  const isDisabled = entryMode === "resume";

  return (
    <div className="job-application-form font-bold text-gray-800 mb-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Application Form</h2>
      <div className="flex justify-center m-8 space-x-4 text-sm">
        <button
          onClick={() => setEntryMode("manual")}
          className={`p-2 m-1 rounded-md border ${
            entryMode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setEntryMode("resume")}
          className={`p-2 m-1 rounded-md border ${
            entryMode === "resume" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Upload Resume
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-md max-w-xl mx-auto space-y-4">
        {entryMode === "resume" && (
          <div className="flex flex-col justify-center items-center p-4 border border-blue-700 rounded-md bg-gray-100 mx-auto">
            {!resumeUploaded ? (
              <input
                name="resume"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full p-2 text-gray-700"
              />
            ) : (
              <>
                <p className="text-green-700 font-medium">
                  ✅ File Uploaded: {candidateForm.resume?.name}
                </p>
                <button
                  type="button"
                  onClick={handleChangeResume}
                  className="mt-3 text-sm text-blue-600 underline"
                >
                  Change Resume
                </button>
              </>
            )}
          </div>
        )}

        
        <div className="flex items-center">
          <label className="w-32 text-left">Name</label>
          <input
            name="fullName"
            placeholder="Full Name"
            value={candidateForm.fullName}
            onChange={handleChange}
            disabled={isDisabled}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <label className="w-32 text-left">Email</label>
          <input
            name="email"
            placeholder="Email Address"
            value={candidateForm.email}
            onChange={handleChange}
            disabled={isDisabled}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <label className="w-32 text-left">Phone</label>
          <input
            name="phone"
            placeholder="Number"
            value={candidateForm.phone}
            onChange={handleChange}
            disabled={isDisabled}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-start">
          <label className="w-32 pt-2 text-left">Education</label>
          <div className="w-full space-y-2">
            <input
              name="degree"
              placeholder="Degree Eg. MCA, Btech"
              value={candidateForm.degree}
              onChange={handleChange}
              disabled={isDisabled}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="institute"
              placeholder="Institute Name"
              value={candidateForm.institute}
              onChange={handleChange}
              disabled={isDisabled}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center">
          <label className="w-32 text-left">Skills</label>
          <input
            name="skills"
            placeholder="Eg. React, Node, Python, HTML"
            value={candidateForm.skills}
            onChange={handleChange}
            disabled={isDisabled}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};