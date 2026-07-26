import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Image as ImageIcon, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const FileUpload = ({ onUpload, isUploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (selectedFile && onUpload) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-sky-500 bg-sky-50/50 scale-[1.01]"
              : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-gray-300"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-gray-900 mb-1">
            Drag & Drop document image here
          </h4>
          <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
            Supports Aadhaar Card, Income Certificate, Caste Certificate (JPG, PNG, PDF up to 10MB)
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Browse Document File
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                {previewUrl ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div>
                <h5 className="text-sm font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </h5>
                <p className="text-xs text-gray-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for OCR Processing
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-gray-100 max-h-48 bg-slate-900 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Document Preview"
                className="object-contain max-h-48 w-full"
              />
            </div>
          )}

          {/* Upload & Analyze Action Button */}
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing OCR & Verification...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Run OCR & Verify Document
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
