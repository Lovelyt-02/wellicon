import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Eye,
  Code2,
  RemoveFormatting,
} from "lucide-react";

export default function RichTextEditor({ value = "", onChange, label, placeholder = "Type or paste your rich text content here..." }) {
  const [activeTab, setActiveTab] = useState("editor"); // "editor" | "code" | "preview"
  const editorRef = useRef(null);

  // Sync value from props to editor HTML if changed externally
  useEffect(() => {
    if (editorRef.current && activeTab === "editor") {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, activeTab]);

  const executeCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt("Enter URL link (e.g. https://example.com):");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-slate-800">{label}</label>}

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-all">
        {/* Editor Top Bar with Mode Switcher */}
        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {/* Formatting Command Toolbar (Visible in editor mode) */}
          {activeTab === "editor" ? (
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => executeCommand("bold")}
                title="Bold (Ctrl+B)"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 font-bold transition-colors"
              >
                <Bold className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("italic")}
                title="Italic (Ctrl+I)"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 italic transition-colors"
              >
                <Italic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("underline")}
                title="Underline (Ctrl+U)"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 underline transition-colors"
              >
                <Underline className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("strikeThrough")}
                title="Strikethrough"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                <Strikethrough className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              <button
                type="button"
                onClick={() => executeCommand("formatBlock", "<h1>")}
                title="Heading 1"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 font-bold text-xs transition-colors flex items-center gap-0.5"
              >
                <Heading1 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("formatBlock", "<h2>")}
                title="Heading 2"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 font-bold text-xs transition-colors flex items-center gap-0.5"
              >
                <Heading2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("formatBlock", "<h3>")}
                title="Heading 3"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 font-bold text-xs transition-colors flex items-center gap-0.5"
              >
                <Heading3 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("formatBlock", "<p>")}
                title="Paragraph"
                className="px-2 py-1 rounded hover:bg-slate-200/80 text-slate-700 font-semibold text-xs transition-colors"
              >
                P
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              <button
                type="button"
                onClick={() => executeCommand("insertUnorderedList")}
                title="Bullet List"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                <List className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("insertOrderedList")}
                title="Numbered List"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("formatBlock", "<blockquote>")}
                title="Quote"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                <Quote className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={addLink}
                title="Insert Link"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              <button
                type="button"
                onClick={() => executeCommand("justifyLeft")}
                title="Align Left"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                <AlignLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("justifyCenter")}
                title="Align Center"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                <AlignCenter className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeCommand("justifyRight")}
                title="Align Right"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                <AlignRight className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              <button
                type="button"
                onClick={() => executeCommand("removeFormat")}
                title="Clear Formatting"
                className="p-1.5 rounded hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                <RemoveFormatting className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {activeTab === "code" ? "HTML Source Mode" : "Public Page Live Preview"}
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg ml-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                activeTab === "editor" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Code className="w-3.5 h-3.5" /> Visual Editor
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                activeTab === "code" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" /> HTML Code
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                activeTab === "preview" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
        </div>

        {/* Tab 1: Visual WYSIWYG Content Editable Field */}
        {activeTab === "editor" && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            className="prose max-w-none p-5 min-h-[350px] max-h-[600px] overflow-y-auto outline-none text-slate-800 text-sm leading-relaxed"
            placeholder={placeholder}
          />
        )}

        {/* Tab 2: Raw HTML Source Textarea */}
        {activeTab === "code" && (
          <textarea
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            rows={15}
            className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 outline-none resize-y min-h-[350px]"
            placeholder="Edit raw HTML code..."
          />
        )}

        {/* Tab 3: Public Page Live Preview */}
        {activeTab === "preview" && (
          <div className="p-8 bg-slate-50 min-h-[350px] max-h-[600px] overflow-y-auto">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: value || "<p class='text-slate-400 italic'>No content to preview.</p>" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
