import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  ShieldCheck,
  Sparkles,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Award,
  Zap,
} from "lucide-react";
import { MOCK_SCHEMES } from "../mock/mockData";
import SchemeCard from "../components/SchemeCard";

const LandingPage = () => {
  const featuredSchemes = MOCK_SCHEMES.slice(0, 3);

  return (
    <MainLayout showSidebar={false}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 bg-gradient-to-b from-sky-50/80 via-white to-slate-50 rounded-3xl mb-12 border border-sky-100/60 shadow-sm">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-sky-600" /> AI-Powered Citizen Assistance
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
            Discover Government Schemes You Are{" "}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
              100% Eligible For
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Eligify uses intelligent rule matching and automated OCR document verification to connect citizens directly with life-changing welfare schemes and subsidies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 hover:scale-105 transition-all"
            >
              Check My Eligibility Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/recommendations"
              className="w-full sm:w-auto px-7 py-3.5 bg-white border border-gray-200 hover:border-sky-300 hover:bg-sky-50/50 text-gray-800 font-bold text-sm rounded-2xl shadow-sm transition-all"
            >
              Browse All Schemes
            </Link>
          </div>

          {/* Quick Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-sky-100">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              <span className="text-xs font-bold text-gray-700">Central & State Schemes</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold text-gray-700">Deterministic Rule Engine</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold text-gray-700">OCR Doc Verification</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold text-gray-700">Instant Explanation</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            How Eligify Works in 3 Simple Steps
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            From profile questionnaire to official portal application in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 font-black text-xl flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fill Your Profile</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Enter your basic demographics, state, annual income, occupation, and education level.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 font-black text-xl flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Rule Engine Evaluation</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our rule engine evaluates every scheme condition and ranks your top matches with confidence scores.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 font-black text-xl flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">OCR Document Verification</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Upload your Aadhaar or Income certificate to auto-verify credentials and apply directly.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Schemes Showcase */}
      <section className="py-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Featured Government Schemes</h2>
            <p className="text-xs text-gray-500">Popular welfare initiatives with instant eligibility checks</p>
          </div>
          <Link
            to="/recommendations"
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
          >
            View All ({MOCK_SCHEMES.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSchemes.map((scheme) => (
            <SchemeCard key={scheme.scheme_id} scheme={scheme} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;
