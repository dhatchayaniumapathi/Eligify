import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Building2, MapPin, Gift, FileText, ChevronRight } from "lucide-react";
import EligibilityBadge from "./EligibilityBadge";

const SchemeCard = ({ scheme }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-sky-200 transition-all flex flex-col justify-between group">
      <div>
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
              <MapPin className="w-3 h-3" /> {scheme.state}
            </span>
            {scheme.category_tag && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {scheme.category_tag}
              </span>
            )}
          </div>
          <EligibilityBadge eligible={scheme.eligible} confidence={scheme.confidence} size="sm" />
        </div>

        {/* Scheme Title & Ministry */}
        <Link to={`/scheme/${scheme.scheme_id}`} className="block group-hover:text-sky-600 transition-colors">
          <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1">
            {scheme.scheme_name}
          </h3>
        </Link>
        <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-4">
          <Building2 className="w-3.5 h-3.5 text-gray-400" />
          {scheme.ministry}
        </p>

        {/* Benefit Highlight */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100 mb-4">
          <div className="flex items-start gap-2">
            <Gift className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-medium text-emerald-900 leading-relaxed">
              {scheme.benefits}
            </p>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {scheme.description}
        </p>

        {/* Required Documents Pill List */}
        {scheme.required_documents && scheme.required_documents.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Required Documents
            </p>
            <div className="flex flex-wrap gap-1.5">
              {scheme.required_documents.slice(0, 3).map((doc, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md"
                >
                  {doc}
                </span>
              ))}
              {scheme.required_documents.length > 3 && (
                <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md">
                  +{scheme.required_documents.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <Link
          to={`/scheme/${scheme.scheme_id}`}
          className="text-xs font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          View Full Breakdown <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        {scheme.application_link && (
          <a
            href={scheme.application_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-colors"
          >
            Apply Now <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export default SchemeCard;
