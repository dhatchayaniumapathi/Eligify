import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Award,
  FileText,
  Gift,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const SchemeCard = ({ scheme }) => {
  const documents = Array.isArray(scheme.required_documents)
    ? scheme.required_documents
    : String(scheme.required_documents || "")
        .split(",")
        .map((doc) => doc.trim())
        .filter(Boolean);

  const confidence = Number(scheme.confidence || 0)*100;
  const ranking = Number(scheme.ranking_score || 0);

  const confidenceColor =
    confidence >= 90
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : confidence >= 70
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">

      <div className="p-6">

        {/* Header */}

        <div className="flex justify-between items-start mb-4">

          <div>

            <h3 className="text-xl font-bold text-gray-900 leading-snug">
              {scheme.scheme_name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              AI Recommended Government Scheme
            </p>

          </div>

          <div
            className={`px-3 py-1 rounded-full border text-sm font-semibold ${confidenceColor}`}
          >
            {confidence.toFixed(1)}%
          </div>

        </div>

        {/* Description */}

        <p className="text-gray-600 text-sm leading-6 mb-5">
          {scheme.description}
        </p>

        {/* Benefits */}

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 mb-5">

          <div className="flex items-center gap-2 mb-2">

            <Gift className="w-4 h-4 text-emerald-600" />

            <h4 className="font-semibold text-emerald-800">
              Benefits
            </h4>

          </div>

          <p className="text-sm text-emerald-700 leading-6">
            {scheme.benefits}
          </p>

        </div>

        {/* AI Explanation */}

        <div className="rounded-xl bg-sky-50 border border-sky-100 p-4 mb-5">

          <div className="flex items-center gap-2 mb-2">

            <Brain className="w-4 h-4 text-sky-600" />

            <h4 className="font-semibold text-sky-800">
              Why AI Recommended This
            </h4>

          </div>

          <p className="text-sm text-sky-700 leading-6">
            {scheme.explanation}
          </p>

        </div>

        {/* Ranking */}

        <div className="flex items-center gap-2 mb-5">

          <Award className="w-5 h-5 text-amber-500" />

          <span className="font-medium text-gray-700">
            Ranking Score
          </span>

          <span className="ml-auto font-bold text-amber-600">
            {ranking.toFixed(1)}
          </span>

        </div>

        {/* Required Documents */}

        <div>

          <div className="flex items-center gap-2 mb-3">

            <FileText className="w-4 h-4 text-gray-500" />

            <h4 className="font-semibold text-gray-800">
              Required Documents
            </h4>

          </div>

          <div className="flex flex-wrap gap-2">

            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                >
                  {doc}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">
                No documents specified
              </span>
            )}

          </div>

        </div>

      </div>
            {/* Footer */}

      <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold">

          <CheckCircle2 className="w-4 h-4" />

          AI Verified Recommendation

        </div>

        <Link
          to={`/scheme/${scheme.id ?? scheme.scheme_id}`}
          className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 font-semibold text-sm"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </Link>

      </div>

    </div>
  );
};

export default SchemeCard;