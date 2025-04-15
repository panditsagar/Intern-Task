import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
 
import JobList from "./components/Job/JobList";
import JobEdit from "./components/Job/JobEdit";
import JobForm from "./components/Job/JobForm";
import ResumeForm from "./components/Resume/ResumeForm.jsx";
import ResumeUpload from "./components/Resume/ResumeUpload.jsx";
 // If you made a separate navbar

const App = () => {
  return (
    <Router>
      <nav className="bg-blue-600 text-white p-4 shadow-md mb-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Job Requirement Module</h1>
          <ul className="flex space-x-6">
            <Link to={"/resumeForm"}>
              {" "}
              <li className="hover:underline cursor-pointer">Resume Form</li>
            </Link>
            <Link to={"/jobpost"}>
              {" "}
              <li className="hover:underline cursor-pointer">Post Job</li>
            </Link>
            <Link to={"/"}>
              {" "}
              <li className="hover:underline cursor-pointer">View Jobs</li>
            </Link>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/jobPost" element={<JobForm />} />
        <Route path="/jobedit" element={<JobEdit />} />
        <Route path="/resumeForm" element={<ResumeForm />} />
        <Route path="/resumeUpload" element={<ResumeUpload />} />
      </Routes>
    </Router>
  );
};
export default App;
