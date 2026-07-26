import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import FileUpload from "../components/FileUpload";
import { ocrService } from "../services/api";
import {
  FileCheck,
  Upload,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
  Hash,
} from "lucide-react";

const OCRUploadPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async (file) => {
    setIsUploading(true);
    setResult(null);
    setError("");

    try {
      const response = await ocrService.uploadDocument(file);
      setResult(response);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to upload document."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <FileCheck className="w-8 h-8 text-sky-600" />
            Document Upload
          </h1>

          <p className="mt-2 text-gray-500">
            Upload your government documents. They will be securely stored and
            marked for verification.
          </p>
        </div>

        {/* Upload */}

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mb-6">

          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-semibold">
              Upload Document
            </h2>
          </div>

          <FileUpload
            onUpload={handleUpload}
            isUploading={isUploading}
          />

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

        </div>

        {/* Success */}

        {result && (
          <div className="space-y-6">

            <div className="rounded-3xl border border-green-200 bg-green-50 p-6">

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-green-800">
                    Upload Successful
                  </h2>

                  <p className="text-green-700">
                    {result.message}
                  </p>
                </div>

              </div>

            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

              <h3 className="text-lg font-semibold mb-6">
                Document Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-sky-600" />
                  <div>
                    <p className="text-xs text-gray-500">
                      Filename
                    </p>
                    <p className="font-semibold">
                      {result.document.filename}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-sky-600" />
                  <div>
                    <p className="text-xs text-gray-500">
                      Document ID
                    </p>
                    <p className="font-semibold">
                      #{result.document.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      Verification Status
                    </p>

                    <span className="inline-block mt-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                      {result.document.verification_status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-xs text-gray-500">
                      Uploaded At
                    </p>

                    <p className="font-semibold">
                      {new Date(
                        result.document.uploaded_at
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Info */}

        {!result && !isUploading && (
          <div className="mt-8 bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

            <h3 className="text-lg font-semibold mb-4">
              Supported Documents
            </h3>

            <div className="grid md:grid-cols-2 gap-4">

              <div className="rounded-xl bg-sky-50 p-4">
                <p className="font-semibold">
                  Identity Documents
                </p>

                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• Aadhaar Card</li>
                  <li>• PAN Card</li>
                  <li>• Voter ID</li>
                </ul>
              </div>

              <div className="rounded-xl bg-indigo-50 p-4">
                <p className="font-semibold">
                  Certificates
                </p>

                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• Income Certificate</li>
                  <li>• Caste Certificate</li>
                  <li>• Disability Certificate</li>
                </ul>
              </div>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default OCRUploadPage;