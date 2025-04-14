import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
 
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
 
const ResumeUpload = () => {
  const [extracted, setExtracted] = useState(null);
 
  const extractTextFromPDF = async (file) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let fullText = '';
 
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        fullText += text.items.map(item => item.str).join(' ') + '\n';
      }
 
      const data = extractFields(fullText);
      setExtracted(data);
    };
    fileReader.readAsArrayBuffer(file);
  };
 
  const extractFields = (text) => {
    return {
      name: text.match(/Name[:\-]?\s*(.+)/i)?.[1]?.trim() || '',
      email: text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i)?.[0] || '',
      phone: text.match(/(?:\+91[-\s]?)?\d{10}/)?.[0] || '',
      education: text.match(/(Bachelor|Master|B\.Tech|MCA|B\.Sc|MBA).+?(University|College)?/i)?.[0] || '',
      skills: ['React', 'Node', 'Python', 'JavaScript', 'CSS', 'HTML'].filter(skill =>
        new RegExp(skill, 'i').test(text)
      )
    };
  };
 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      extractTextFromPDF(file);
    } else {
      alert("Please upload a PDF file");
    }
  };
 
  return (
<div className="p-4 border rounded">
<input type="file" accept="application/pdf" onChange={handleFileChange} />
      {extracted && (
<div className="mt-4 bg-gray-100 p-3 rounded">
<h3 className="font-semibold">Extracted Info:</h3>
<pre>{JSON.stringify(extracted, null, 2)}</pre>
</div>
      )}
</div>
  );
};
 
export default ResumeUpload;