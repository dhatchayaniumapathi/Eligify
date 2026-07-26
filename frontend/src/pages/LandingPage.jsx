import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  Sparkles,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
} from "lucide-react";
import SchemeCard from "../components/SchemeCard";
import { schemeService } from "../services/api";

const LandingPage = () => {
  const [featuredSchemes, setFeaturedSchemes] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const data = await schemeService.getSchemes();
        setFeaturedSchemes(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to load schemes:", error);
      }
    };

    fetchSchemes();
  }, []);

  return (
    <MainLayout showSidebar={false}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 bg-gradient-to-b from-sky-50/80 via-white to-slate-50 rounded-3xl mb-12 border border-sky-100/60 shadow-sm">
        <div className="max-w-4xl mx-auto text-center px-4">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-sky-600" />
            AI-Powered Citizen Assistance
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
            Discover Government Schemes You Are{" "}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
              Eligible For
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Eligify uses AI-powered eligibility checking and OCR document
            verification to help citizens find the right government schemes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg"
            >
              Check My Eligibility
            </Link>

            <Link
              to="/schemes"
              className="w-full sm:w-auto px-7 py-3.5 bg-white border border-gray-200 hover:border-sky-300 text-gray-800 font-bold text-sm rounded-2xl shadow-sm"
            >
              Browse Schemes
            </Link>
          </div>

          {/* Trust Badges */}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-sky-100">

            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              <span className="text-xs font-bold text-gray-700">
                Government Schemes
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold text-gray-700">
                AI Eligibility
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold text-gray-700">
                OCR Verification
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold text-gray-700">
                Instant Results
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}

      <section className="py-8 mb-16">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            How Eligify Works
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Find and verify your eligible schemes in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 font-black text-xl flex items-center justify-center mb-4">
              1
            </div>

            <h3 className="text-lg font-bold mb-2">
              Complete Your Profile
            </h3>

            <p className="text-sm text-gray-600">
              Enter your personal details to check eligibility.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 font-black text-xl flex items-center justify-center mb-4">
              2
            </div>

            <h3 className="text-lg font-bold mb-2">
              AI Recommendation
            </h3>

            <p className="text-sm text-gray-600">
              Eligify finds the best matching government schemes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 font-black text-xl flex items-center justify-center mb-4">
              3
            </div>

            <h3 className="text-lg font-bold mb-2">
              Verify Documents
            </h3>

            <p className="text-sm text-gray-600">
              Upload your documents for OCR verification.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Schemes */}

      <section className="py-8 mb-12">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Featured Schemes
            </h2>

            <p className="text-xs text-gray-500">
              AI recommended government schemes
            </p>
          </div>

          <Link
            to="/schemes"
            className="text-sm font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-2"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {featuredSchemes.length > 0 ? (
            featuredSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.scheme_id}
                scheme={scheme}
              />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-10">
              No schemes available.
            </div>
          )}

        </div>

      </section>
    </MainLayout>
  );
};

export default LandingPage;