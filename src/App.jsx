import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import JobList from "./components/Job/JobList";
import JobEdit from "./components/Job/JobEdit";
import JobForm from "./components/Job/JobForm";
import ResumeForm from "./components/Resume/ResumeForm.jsx";
import { Hiring } from "./components/Job/Hiring.jsx";
<<<<<<< HEAD
import OfferLetterGenerator from "./components/offer Latter/OfferLetterGenerator.jsx";
 
=======
import Docx from "./components/Docx/Docx.jsx";


>>>>>>> 1ba308f73a84de6913b11dbe2618e7089806d8ea


const App = () => {
  return (
    <Router>
      <nav className="bg-green-600 text-white p-4 font-light shadow-md mb-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl">Job Requirement Module</h1>
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
            <Link to={"/docx"}>
              {" "}
              <li className="hover:underline cursor-pointer">Docx</li>
            </Link>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/jobPost" element={<JobForm />} />
        <Route path="/jobedit" element={<JobEdit />} />
        <Route path="/resumeForm" element={<ResumeForm />} />
        <Route path="/hiring" element={<Hiring />} />
        <Route path="/offer-later" element={<OfferLetterGenerator />} />
        <Route path="/docx" element={<Docx />} />
      </Routes>
    </Router>
  );
};
export default App;