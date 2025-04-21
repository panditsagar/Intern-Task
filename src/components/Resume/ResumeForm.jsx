import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?worker';
pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

const ResumeForm = () => {
  const [candidateForm, setCandidateForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    primarySkill: '',
    secondarySkill: '',
    location: '',
    experience: '',
    resumeAvailable: 'No',
    certifications: 'No',
    resume: null,
  });

  const [entryMode, setEntryMode] = useState('manual');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [fileError, setFileError] = useState('');
  const [resumeURL, setResumeURL] = useState(null);

  const extractName = (text) => {
    const fallbackPattern = /([A-Z]{2,})(\s[A-Z]{2,})+/;
    const match = text.match(fallbackPattern);
    if (match && !/resume|curriculum vitae|cv/i.test(match[0])) {
      return match[0];
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
    const fileURL = URL.createObjectURL(file);
    setResumeURL(fileURL);

    if (!file || file.type !== 'application/pdf') {
      setFileError('Please upload a valid PDF file');
      return;
    }

    setFileError('');
    setResumeUploaded(true);
    setCandidateForm((prev) => ({ ...prev, resume: file, resumeAvailable: 'Yes' }));

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

        const nameFromTop = extractName(extractedText);
        const emailMatch = extractedText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i);
        const phoneMatch = extractedText.match(/(?:\+91[-\s]?)?\d{10}/);
        const skillsList = ['React', 'Node', 'Python', 'JavaScript', 'CSS', 'HTML', 'MongoDB', 'Express'];
        const foundSkills = skillsList.filter((skill) => new RegExp(skill, 'i').test(extractedText));
        const certMatch = extractedText.match(/certificat(e|ion)/i);

        setCandidateForm((prev) => ({
          ...prev,
          fullName: nameFromTop || '',
          email: emailMatch?.[0] || '',
          phone: phoneMatch?.[0] || '',
          primarySkill: foundSkills[0] || '',
          secondarySkill: foundSkills.slice(1).join(', ') || '',
          certifications: certMatch ? 'Yes' : 'No',
        }));
      } catch (err) {
        console.error('Error extracting text:', err);
        setFileError('Failed to extract text from PDF');
      }
    };
  };

  const handleChangeResume = () => {
    setCandidateForm((prev) => ({ ...prev, resume: null, resumeAvailable: 'No' }));
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
      address: '',
      primarySkill: '',
      secondarySkill: '',
      location: '',
      experience: '',
      resumeAvailable: 'No',
      certifications: 'No',
      resume: null,
    });
    setResumeUploaded(false);
  };

  const isDisabled = entryMode === 'resume';

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 py-8">
      <div className="md:w-1/2 w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Application Form</h2>

        <div className="flex justify-center mb-6 space-x-4 text-sm">
          <button
            type="button"
            onClick={() => setEntryMode('manual')}
            className={`px-4 py-2 rounded-md border hover:bg-green-400 transition duration-300 cursor-pointer ${entryMode === 'manual' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Manual Entry
          </button>
          <button
            type="button"
            onClick={() => setEntryMode('resume')}
            className={`px-4 py-2 rounded-md border hover:bg-green-400 transition duration-300 cursor-pointer ${entryMode === 'resume' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Upload Resume
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {entryMode === 'resume' && (
            <div className="flex flex-col justify-center items-center p-4 border border-green-700 rounded-md bg-gray-100">
              {!resumeUploaded ? (
                <input
                  name="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full p-2 text-gray-700 hover:cursor-pointer"
                />
              ) : (
                <>
                  <p className="text-green-900 font-medium">
                    File Uploaded: {candidateForm.resume?.name}
                  </p>
                  <button
                    type="button"
                    onClick={handleChangeResume}
                    className="mt-3 text-sm text-green-600 underline hover:cursor-pointer"
                  >
                    Change Resume
                  </button>
                </>
              )}
              {fileError && <p className="text-red-500 mt-2">{fileError}</p>}
            </div>
          )}

          <div className="flex items-center">
            <label className="w-40 text-left">Name</label>
            <input name="fullName" value={candidateForm.fullName} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-left">Phone Number</label>
            <input name="phone" value={candidateForm.phone} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-left">Email ID</label>
            <input name="email" value={candidateForm.email} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-left">Address (City)</label>
            <input name="address" value={candidateForm.address} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-left">Primary Skill</label>
            <input name="primarySkill" value={candidateForm.primarySkill} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-left">Secondary Skill</label>
            <input name="secondarySkill" value={candidateForm.secondarySkill} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-left">Location</label>
            <select name="location" value={candidateForm.location} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="">Select</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Office">Office</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-40 text-left">Experience (years)</label>
            <input name="experience" value={candidateForm.experience} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-left">Resume Available</label>
            <input name="resumeAvailable" value={candidateForm.resumeAvailable} disabled className="w-full p-2 border rounded-md bg-gray-100" />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-left">Certifications</label>
            <input name="certifications" value={candidateForm.certifications} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>

          <button type="submit" className="bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 w-full">
            Submit
          </button>
        </form>
      </div>

      <div className="md:w-1/2 w-full bg-white rounded-lg shadow-lg p-4">
        {resumeURL ? (
          <div className="h-[750px] border rounded-md overflow-hidden shadow-md">
            <iframe src={`${resumeURL}#zoom=75`} width="100%" height="100%" className="rounded-md" title="Resume Preview" />
          </div>
        ) : (
          <p className="text-center text-gray-500">Upload a resume to preview here</p>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
