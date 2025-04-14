import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ResumeForm = () => {
    const [candidateForm, setCandidateForm] = useState({
        fullName: "",
        email: "",
        education: "",
        skills: "",
        experience: "",
        resume: null,
    });

    const [entryMode, setEntryMode] = useState("manual");

    const navigate = useNavigate();
    navigate("/resumeForm");

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
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setCandidateForm({
            fullName: "",
            email: "",
            education: "",
            skills: "",
            experience: "",
            resume: null,
        });
    };

    const isDisabled = entryMode === "resume";

    return (
        <div className="job-application-form font-bold text-gray-800 mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Application Form
            </h2>
            <div className="flex justify-center m-8 space-x-4 text-sm">
                <button
                    onClick={() => setEntryMode("manual")}
                    className={`p-2 m-1 rounded-md border ${entryMode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                >
                    Manual Entry
                </button>
                <button
                    onClick={() => setEntryMode("resume")}
                    className={`p-2 m-1 rounded-md border ${entryMode === "resume" ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                >
                    Upload Resume
                </button>
            </div>
            <form
                onSubmit={handleSubmit}
                className="p-6 bg-white shadow-md rounded-md max-w-xl mx-auto space-y-4"
            >
                {entryMode === "resume" && (
                    <div className="flex justify-center items-center p-4 border border-blue-700 rounded-md bg-gray-200 mx-auto">
                        <input
                            name="resume"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="w-full p-2 text-gray-700"
                            style={{
                                margin: "0 auto",
                                textAlign: "center",
                                display: "block",
                                padding: "5px",
                            }}
                        />
                    </div>
                )}
                <input
                    name="fullName"
                    placeholder="Full Name"
                    value={candidateForm.fullName}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    name="email"
                    placeholder="Email Address"
                    value={candidateForm.email}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    name="education"
                    placeholder="Education"
                    value={candidateForm.education}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    name="skills"
                    placeholder="Skills"
                    value={candidateForm.skills}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    name="experience"
                    placeholder="Experience in Years"
                    value={candidateForm.experience}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
