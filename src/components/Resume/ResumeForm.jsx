import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?worker';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

const ResumeForm = () => {
  const [candidateForm, setCandidateForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    degree: '',
    institute: '',
    skills: '',
    resume: null,
  });

  const [entryMode, setEntryMode] = useState('manual');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);

 

  const extractName = (text) => {
    const fallbackPattern = /([A-Z]{2,})(\s[A-Z]{2,})+/;
    const match = text.match(fallbackPattern);
  
    if (match) {
      const name = match[0];
      if (!/resume|curriculum vitae|cv/i.test(name)) {
        return name;
      }
    }
  
    return '';
  };
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file || file.type !== 'application/pdf') {
      setFileError('Please upload a valid PDF file');
      return;
    }

    setFileError('');
    setResumeUploaded(true);
    setCandidateForm((prev) => ({ ...prev, resume: file }));
    setLoading(true);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      const typedArray = new Uint8Array(e.target.result);
      try {
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        let extractedText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(' ');
          extractedText += ' ' + pageText;
        }

        // Extract fields from text
        const nameFromTop = extractName(extractedText);
        const emailMatch = extractedText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i);
        const phoneMatch = extractedText.match(/(?:\+91[-\s]?)?\d{10}/);
        const degreeMatch = extractedText.match(/(B\.?Tech|M\.?Tech|MCA|B\.?Sc|MBA|B\.?E|Bachelor|Master)[^,;\n]*/i);
        const instituteMatch = extractedText.match(/(University|College|Institute)\s+of\s+[A-Za-z ]+/i);

        const skillsList = ['React', 'Node', 'Python', 'JavaScript', 'CSS', 'HTML'];
        const foundSkills = skillsList.filter((skill) => new RegExp(skill, 'i').test(extractedText)).join(', ');

        setCandidateForm((prev) => ({
          ...prev,
          fullName: nameFromTop || '',
          email: emailMatch?.[0] || '',
          phone: phoneMatch?.[0] || '',
          degree: degreeMatch?.[0]?.trim() || '',
          institute: instituteMatch?.[0]?.trim() || '',
          skills: foundSkills || '',
        }));
      } catch (err) {
        console.error('Error extracting text:', err);
        setFileError('Failed to extract text from PDF');
      }
      setLoading(false);
    };
  };

  const handleChangeResume = () => {
    setCandidateForm((prev) => ({ ...prev, resume: null }));
    setResumeUploaded(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', candidateForm);
    alert('Application Submitted!');
    setCandidateForm({
      fullName: '',
      email: '',
      phone: '',
      degree: '',
      institute: '',
      skills: '',
      resume: null,
    });
    setResumeUploaded(false);
  };

  const isDisabled = entryMode === 'resume';

  return (
    <div className="job-application-form font-bold text-gray-800 mb-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Application Form</h2>
      <div className="flex justify-center m-8 space-x-4 text-sm">
        <button
          type="button"
          onClick={() => setEntryMode('manual')}
          className={`p-2 m-1 rounded-md border ${entryMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Manual Entry
        </button>
        <button
          type="button"
          onClick={() => setEntryMode('resume')}
          className={`p-2 m-1 rounded-md border ${entryMode === 'resume' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Upload Resume
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-md max-w-xl mx-auto space-y-4">
        {entryMode === 'resume' && (
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
                <p className="text-green-900 font-medium">
                  File Uploaded: {candidateForm.resume?.name}
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
            {fileError && <p className="text-red-500 mt-2">{fileError}</p>}
            {loading && <p className="text-gray-700 mt-2">⏳ Extracting data...</p>}
          </div>
        )}

        <div className="flex items-center">
          <label className="w-32 text-left">Name</label>
          <input
            name="fullName"
            placeholder="Full Name"
            value={candidateForm.fullName}
            onChange={handleChange}
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
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-start">
          <label className="w-32 pt-2 text-left">Education</label>
          <div className="w-full space-y-2">
            <input
              name="degree"
              placeholder="Degree (Eg. MCA, BTech)"
              value={candidateForm.degree}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="institute"
              placeholder="Institute Name"
              value={candidateForm.institute}
              onChange={handleChange}
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

export default ResumeForm;
