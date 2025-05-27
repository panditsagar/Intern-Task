import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import html2pdf from "html2pdf.js";
import { saveAs } from "file-saver";

const LOCAL_STORAGE_KEY = "myDocuments";

export default function OfferLetterGenerator() {
  // Document list state
  const [documents, setDocuments] = useState([]);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [title, setTitle] = useState("");

  // Editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      if (currentDocId) {
        const updatedDocs = documents.map((doc) =>
          doc.id === currentDocId ? { ...doc, content: editor.getHTML() } : doc
        );
        setDocuments(updatedDocs);
      }
    },
  });

  // Load documents from localStorage on mount
  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setDocuments(savedDocs);
    if (savedDocs.length > 0) {
      setCurrentDocId(savedDocs[0].id);
      setTitle(savedDocs[0].title);
      editor?.commands.setContent(savedDocs[0].content);
    }
  }, [editor]);

  // When currentDocId changes, load its content into editor and update title
  useEffect(() => {
    if (!currentDocId) return;
    const doc = documents.find((d) => d.id === currentDocId);
    if (doc && editor) {
      editor.commands.setContent(doc.content);
      setTitle(doc.title);
    }
  }, [currentDocId, documents, editor]);

  // Save documents list to localStorage when documents change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  // Create new document (blank)
  const createNewDocument = () => {
    const newDoc = {
      id: Date.now().toString(),
      title: "Untitled Document",
      content: "<p></p>",
    };
    setDocuments([newDoc, ...documents]);
    setCurrentDocId(newDoc.id);
    editor?.commands.setContent("<p></p>");
    setTitle(newDoc.title);
  };

  // Delete current document
  const deleteCurrentDocument = () => {
    if (!currentDocId) return;
    const filtered = documents.filter((doc) => doc.id !== currentDocId);
    setDocuments(filtered);
    if (filtered.length > 0) {
      setCurrentDocId(filtered[0].id);
    } else {
      setCurrentDocId(null);
      editor?.commands.setContent("");
      setTitle("");
    }
  };

  // Rename document
  const renameDocument = (e) => {
    setTitle(e.target.value);
    setDocuments(
      documents.map((doc) =>
        doc.id === currentDocId ? { ...doc, title: e.target.value } : doc
      )
    );
  };

  // Export current document as PDF
  const exportPDF = () => {
    if (!editor) return;
    const element = document.createElement("div");
    element.innerHTML = editor.getHTML();
    html2pdf().from(element).save(title ? `${title}.pdf` : "document.pdf");
  };

  // Export current document as DOCX (simple HTML to doc)
  const exportDOCX = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], {
      type: "application/msword",
    });
    saveAs(blob, `${title || "document"}.docx`);
  };

  // Print current document
  const printDoc = () => {
    if (!editor) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html><head><title>${title}</title></head>
      <body>${editor.getHTML()}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-4">Documents</h1>
        <button
          onClick={createNewDocument}
          className="mb-3 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + New Document
        </button>
        <div className="overflow-y-auto flex-grow">
          {documents.length === 0 && (
            <p className="text-gray-500">No documents yet.</p>
          )}
          <ul>
            {documents.map((doc) => (
              <li
                key={doc.id}
                className={`cursor-pointer p-2 rounded ${
                  doc.id === currentDocId
                    ? "bg-blue-100 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentDocId(doc.id)}
              >
                {doc.title || "Untitled"}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={deleteCurrentDocument}
          disabled={!currentDocId}
          className="mt-4 px-3 py-2 bg-red-600 text-white rounded disabled:opacity-50"
        >
          Delete Document
        </button>
      </aside>

      {/* Main editor area */}
      <main className="flex-grow flex flex-col p-4">
        {currentDocId ? (
          <>
            <input
              value={title}
              onChange={renameDocument}
              placeholder="Document Title"
              className="mb-4 text-2xl font-semibold border-b border-gray-300 p-2"
            />

            {/* Toolbar */}
            <Toolbar editor={editor} />

            {/* Editor */}
            <div className="flex-grow border rounded bg-white p-4 overflow-auto min-h-[400px]">
              <EditorContent editor={editor} />
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Export PDF
              </button>
              <button
                onClick={exportDOCX}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Export DOCX
              </button>
              <button
                onClick={printDoc}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Print
              </button>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-400">
            No document selected. Create a new one!
          </div>
        )}
      </main>
    </div>
  );
}

function Toolbar({ editor }) {
  if (!editor) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {/* <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        type="button"
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        type="button"
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive("underline"))}
        type="button"
      >
        Underline
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
        type="button"
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
        type="button"
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
        type="button"
      >
        Ordered List
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={buttonClass(editor.isActive("paragraph"))}
        type="button"
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
        type="button"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        type="button"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
        type="button"
      >
        H3
      </button> */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        type="button"
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        type="button"
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        Redo
      </button>
    </div>
  );
}

function buttonClass(active) {
  return `px-3 py-1 rounded ${
    active ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
  }`;
}
