import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import EligibilityBadge from '../components/EligibilityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { schemeService } from '../services/api';
import {
  Building2, MapPin, ExternalLink, FileText, CheckCircle2, XCircle,
  Gift, ArrowLeft, Info,
} from 'lucide-react';

const SchemeDetailPage = () => {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    schemeService.getSchemeById(id)
      .then(setScheme)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <MainLayout><LoadingSpinner label="Loading scheme details..." /></MainLayout>;
  if (error) return (
    <MainLayout>
      <div className="text-center py-20">
        <p className="text-rose-600 font-semibold mb-4">{error}</p>
        <Link to="/schemes" className="text-sky-600 text-sm font-semibold hover:underline">← Back to Schemes</Link>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <Link to="/schemes" className="inline-flex items-center gap-1.5 text-sm text-sky-600 font-semibold hover:text-sky-800 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to All Schemes
      </Link>

      {/* Hero header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                <MapPin className="w-3 h-3" /> {scheme.state}
              </span>
              {scheme.category_tag && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {scheme.category_tag}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">{scheme.scheme_name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-gray-400" /> {scheme.ministry}
            </p>
          </div>
          <EligibilityBadge eligible={scheme.eligible} confidence={scheme.confidence} />
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mt-4 pt-4 border-t border-gray-100">
          {scheme.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Benefits */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-3xl border border-emerald-100 p-5">
            <h2 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-3">
              <Gift className="w-4 h-4 text-emerald-600" /> Scheme Benefits
            </h2>
            <p className="text-sm text-emerald-800 leading-relaxed">{scheme.benefits}</p>
          </div>

          {/* Eligibility Breakdown */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600" /> AI Eligibility Breakdown
            </h2>
            <p className="text-xs text-gray-500 bg-sky-50 rounded-xl p-3 mb-4 border border-sky-100">
              {scheme.explanation}
            </p>

            {scheme.matched_conditions?.length > 0 && (
              <>
                <p className="text-xs font-bold text-emerald-700 mb-2 uppercase tracking-wide">Passed Criteria</p>
                <ul className="space-y-1.5 mb-4">
                  {scheme.matched_conditions.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {scheme.failed_conditions?.length > 0 && (
              <>
                <p className="text-xs font-bold text-rose-700 mb-2 uppercase tracking-wide">Failed Criteria</p>
                <ul className="space-y-1.5">
                  {scheme.failed_conditions.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <XCircle className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Eligibility Criteria */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Eligibility Criteria</h2>
            <dl className="space-y-2.5 text-xs">
              {[
                ['Age Range', `${scheme.min_age} – ${scheme.max_age} yrs`],
                ['Gender', scheme.gender],
                ['Category', scheme.category],
                ['State', scheme.state],
                ['Max Income', scheme.max_income > 0 ? `Rs. ${Number(scheme.max_income).toLocaleString('en-IN')}` : 'No Limit'],
                ['Occupation', scheme.occupation],
                ['Education', scheme.education],
                ['Disability Required', scheme.disability_required ? 'Yes (40%+)' : 'No'],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <dt className="text-gray-500 font-medium">{label}</dt>
                  <dd className="font-semibold text-gray-800">{val}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Required Documents */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" /> Required Documents
            </h2>
            <ul className="space-y-2">
              {scheme.required_documents?.map((doc, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-700 py-1 border-b border-gray-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Apply CTA */}
          {scheme.application_link && (
            <a href={scheme.application_link} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-sky-500/20 transition-all">
              Apply on Official Portal <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SchemeDetailPage;
