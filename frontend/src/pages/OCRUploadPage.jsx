import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import FileUpload from '../components/FileUpload';
import { ocrService } from '../services/api';
import {
  FileCheck, ShieldCheck, AlertTriangle, CheckCircle2, XCircle,
  Hash, User, Calendar, MapPin, BadgeCheck, DollarSign,
} from 'lucide-react';

const FIELD_META = {
  aadhaar_number: { label: 'Aadhaar Number', icon: Hash },
  name: { label: 'Full Name', icon: User },
  dob: { label: 'Date of Birth', icon: Calendar },
  gender: { label: 'Gender', icon: User },
  state: { label: 'State', icon: MapPin },
  category: { label: 'Category', icon: BadgeCheck },
  annual_income: { label: 'Annual Income', icon: DollarSign },
};

const OCRUploadPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [docType, setDocType] = useState('Aadhaar Card');

  const handleUpload = async (file) => {
    setIsUploading(true);
    setResult(null);
    try {
      const res = await ocrService.uploadDocument(file, docType);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-sky-600" /> OCR Document Verification
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Upload your identity or income document. Our AI will extract and verify your credentials automatically.
          </p>
        </div>

        {/* Document type selector */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-700 mb-2">Select Document Type</p>
          <div className="flex flex-wrap gap-2">
            {['Aadhaar Card', 'Income Certificate', 'Caste Certificate', 'Disability Certificate'].map((t) => (
              <button key={t} type="button" onClick={() => setDocType(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  docType === t
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Component */}
        <div className="mb-6">
          <FileUpload onUpload={handleUpload} isUploading={isUploading} />
        </div>

        {/* Verification Result */}
        {result && (
          <div className="space-y-5">
            {/* Verification Status Banner */}
            <div className={`rounded-3xl border p-5 flex items-start gap-4 ${
              result.is_verified
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                result.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {result.is_verified
                  ? <ShieldCheck className="w-6 h-6" />
                  : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className={`text-base font-bold mb-1 ${result.is_verified ? 'text-emerald-900' : 'text-amber-900'}`}>
                  {result.is_verified ? 'Document Verified Successfully' : 'Partial Verification — Review Required'}
                </h3>
                <p className="text-sm text-gray-600">{result.summary}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    result.is_verified ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                  }`}>
                    Match Score: {Math.round(result.match_score * 100)}%
                  </span>
                  <span className="text-xs text-gray-500">
                    {result.matched_fields?.length} of{' '}
                    {(result.matched_fields?.length || 0) + (result.mismatched_fields?.length || 0)} fields matched
                  </span>
                </div>
              </div>
            </div>

            {/* Extracted Fields Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Extracted Document Fields</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(result.extracted_fields || {}).map(([key, field]) => {
                  const meta = FIELD_META[key] || { label: key, icon: FileCheck };
                  const Icon = meta.icon;
                  const isMatched = result.matched_fields?.includes(key);
                  const isMismatched = result.mismatched_fields?.includes(key);

                  return (
                    <div key={key} className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                      isMismatched
                        ? 'bg-rose-50 border-rose-200'
                        : isMatched
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-gray-50 border-gray-100'
                    }`}>
                      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        isMismatched ? 'text-rose-600' : isMatched ? 'text-emerald-600' : 'text-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{meta.label}</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{field.field_value || '—'}</p>
                        <p className="text-[10px] text-gray-400">
                          Confidence: {Math.round((field.confidence || 0) * 100)}%
                        </p>
                      </div>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                      {isMismatched && <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        {!result && !isUploading && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">How OCR Verification Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Upload Document', desc: 'Scan or photograph your government ID or certificate.' },
                { step: '2', title: 'AI Text Extraction', desc: 'EasyOCR engine extracts key fields with confidence scoring.' },
                { step: '3', title: 'Profile Cross-Check', desc: 'Extracted fields are verified against your profile claims.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 font-black text-sm flex items-center justify-center flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OCRUploadPage;
