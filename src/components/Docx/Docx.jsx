import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

function Docx() {
    const [showEditor, setShowEditor] = useState(false);
    const [savedPdfs, setSavedPdfs] = useState([]);
    const contentRef = useRef(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('pdfHistory')) || [];
        setSavedPdfs(saved);
    }, []);

    const handleOpenEditor = () => {
        setShowEditor(true);
    };

    const viewPdf = (base64) => {
        const win = window.open();
        if (win) {
            win.document.write(`
        <html>
          <head>
            <title>View PDF</title>
            <style>
              body, html {
                margin: 0; height: 100%; background: #fff;
              }
              iframe {
                border: none; width: 100%; height: 100vh; display: block;
              }
            </style>
          </head>
          <body>
            <iframe src="${base64}" allowfullscreen></iframe>
          </body>
        </html>`);
        } else {
            alert('Please allow popups for this website');
        }
    };

    const downloadPdf = () => {
        const doc = new jsPDF({
            unit: 'pt',
            format: 'a4',
        });

        doc.html(contentRef.current, {
            callback: function (doc) {
                const pdfBlob = doc.output('blob');
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64data = reader.result;
                    const timestamp = new Date().toLocaleString();
                    const newPdf = {
                        id: Date.now(),
                        name: `OfferLetter-${timestamp}`,
                        createdAt: timestamp,
                        data: base64data,
                    };

                    const updatedPdfs = [...savedPdfs, newPdf];
                    setSavedPdfs(updatedPdfs);
                    localStorage.setItem('pdfHistory', JSON.stringify(updatedPdfs));

                    doc.save('OfferLetter.pdf');
                    setShowEditor(false);
                };

                reader.readAsDataURL(pdfBlob);
            },
            x: 40,
            y: 40,
            width: 515,
            windowWidth: contentRef.current.scrollWidth,
        });
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#f5f7fa',
                padding: '40px 20px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: '#333',
            }}
        >
            <div
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    padding: '40px 50px',
                }}
            >
                <h1
                    style={{
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '2rem',
                        marginBottom: '20px',
                        color: '#3a3a3a',
                        letterSpacing: '1px',
                    }}
                >
                    Offer Letter Generator
                </h1>

                {!showEditor && (
                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={handleOpenEditor}
                            style={{
                                padding: '14px 36px',
                                fontSize: '18px',
                                backgroundColor: '#4a90e2',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                boxShadow: '0 4px 10px rgba(74, 144, 226, 0.4)',
                                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                                userSelect: 'none',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#357ABD';
                                e.currentTarget.style.boxShadow = '0 6px 15px rgba(53, 122, 189, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#4a90e2';
                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(74, 144, 226, 0.4)';
                            }}
                        >
                            Create an Offer Letter
                        </button>
                    </div>
                )}

                {showEditor && (
                    <>
                        <div
                            ref={contentRef}
                            contentEditable
                            style={{
                                marginTop: '25px',
                                border: '1.5px solid #4a90e2',
                                borderRadius: '8px',
                                minHeight: '400px',
                                padding: '25px 30px',
                                fontSize: '16pt',
                                lineHeight: '1.6',
                                backgroundColor: '#fafafa',
                                whiteSpace: 'pre-wrap',
                                outline: 'none',
                                color: '#444',
                                transition: 'border-color 0.3s ease',
                            }}
                            suppressContentEditableWarning={true}
                            spellCheck={false}
                            onFocus={(e) => (e.currentTarget.style.borderColor = '#357ABD')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = '#4a90e2')}
                        ></div>

                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <button
                                onClick={downloadPdf}
                                style={{
                                    padding: '14px 36px',
                                    fontSize: '18px',
                                    backgroundColor: '#4a90e2',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 10px rgba(74, 144, 226, 0.4)',
                                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                                    userSelect: 'none',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#357ABD';
                                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(53, 122, 189, 0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#4a90e2';
                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(74, 144, 226, 0.4)';
                                }}
                            >
                                Generate PDF & Download
                            </button>
                        </div>
                    </>
                )}

                {savedPdfs.length > 0 && (
                    <div style={{ marginTop: '60px' }}>
                        <h3
                            style={{
                                textAlign: 'center',
                                marginBottom: '25px',
                                fontWeight: '600',
                                color: '#3a3a3a',
                                letterSpacing: '0.6px',
                            }}
                        >
                            Saved PDFs
                        </h3>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '16px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                borderRadius: '8px',
                                overflow: 'hidden',
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        backgroundColor: '#4a90e2',
                                        color: '#fff',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        fontWeight: '600',
                                    }}
                                >
                                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>#</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Created At</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedPdfs.map((pdf, index) => (
                                    <tr
                                        key={pdf.id}
                                        style={{
                                            backgroundColor: index % 2 === 0 ? '#f9fbfd' : '#ffffff',
                                            transition: 'background-color 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e6f0ff')}
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f9fbfd' : '#ffffff')
                                        }
                                    >
                                        <td
                                            style={{
                                                padding: '14px 15px',
                                                color: '#4a90e2',
                                                fontWeight: '600',
                                                borderBottom: '1px solid #ddd',
                                            }}
                                        >
                                            {index + 1}
                                        </td>
                                        <td style={{ padding: '14px 15px', borderBottom: '1px solid #ddd' }}>{pdf.name}</td>
                                        <td
                                            style={{
                                                padding: '14px 15px',
                                                color: '#666',
                                                borderBottom: '1px solid #ddd',
                                            }}
                                        >
                                            {pdf.createdAt}
                                        </td>
                                        <td
                                            style={{
                                                padding: '14px 15px',
                                                textAlign: 'center',
                                                borderBottom: '1px solid #ddd',
                                            }}
                                        >
                                            <button
                                                onClick={() => viewPdf(pdf.data)}
                                                style={{
                                                    padding: '8px 20px',
                                                    backgroundColor: '#4a90e2',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    boxShadow: '0 3px 8px rgba(74, 144, 226, 0.4)',
                                                    transition: 'background-color 0.3s ease',
                                                    userSelect: 'none',
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357ABD')}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a90e2')}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Docx;
