import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProfileCard from "../components/ProfileCard";
import SchemeCard from "../components/SchemeCard";
import LoadingSpinner from "../components/LoadingSpinner";

import { useAuth } from "../context/AuthContext";
import { schemeService } from "../services/api";

import {
  Brain,
  Sparkles,
  Trophy,
  FileText,
  ArrowRight,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await schemeService.checkEligibility();
      setEligibility(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner
          fullScreen
          label="Loading your AI recommendations..."
        />
      </MainLayout>
    );
  }

  const schemes = eligibility?.recommended_schemes || [];

  const highestConfidence =
    schemes.length > 0
      ? Math.max(...schemes.map((s) => Number(s.confidence || 0)))
      : 0;

  const highestRanking =
    schemes.length > 0
      ? Math.max(...schemes.map((s) => Number(s.ranking_score || 0)))
      : 0;

  const uniqueDocuments = new Set();

  schemes.forEach((scheme) => {
    const docs = Array.isArray(scheme.required_documents)
      ? scheme.required_documents
      : String(scheme.required_documents || "")
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean);

    docs.forEach((doc) => uniqueDocuments.add(doc));
  });

  return (
    <MainLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">

          Welcome back,
          {" "}
          {user?.name || "User"} 👋

        </h1>

        <p className="text-gray-500 mt-2">

          Here are your AI-powered government scheme recommendations.

        </p>

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-2xl shadow-sm border p-5">

          <div className="flex justify-between items-center mb-3">

            <span className="text-sm text-gray-500">
              Recommended Schemes
            </span>

            <Sparkles className="w-5 h-5 text-sky-500" />

          </div>

          <h2 className="text-3xl font-bold">

            {schemes.length}

          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">

          <div className="flex justify-between items-center mb-3">

            <span className="text-sm text-gray-500">
              Highest Confidence
            </span>

            <Brain className="w-5 h-5 text-indigo-500" />

          </div>

          <h2 className="text-3xl font-bold">

            {highestConfidence.toFixed(1)}%

          </h2>

        </div>
                <div className="bg-white rounded-2xl shadow-sm border p-5">

          <div className="flex justify-between items-center mb-3">

            <span className="text-sm text-gray-500">
              Best Ranking Score
            </span>

            <Trophy className="w-5 h-5 text-amber-500" />

          </div>

          <h2 className="text-3xl font-bold">

            {highestRanking.toFixed(1)}

          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">

          <div className="flex justify-between items-center mb-3">

            <span className="text-sm text-gray-500">
              Required Documents
            </span>

            <FileText className="w-5 h-5 text-emerald-500" />

          </div>

          <h2 className="text-3xl font-bold">

            {uniqueDocuments.size}

          </h2>

        </div>

      </div>

      {/* Profile */}

      <div className="mb-8">

        <ProfileCard user={user} />

      </div>

      {/* Recommendations */}

      <div className="mb-8">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              AI Recommended Schemes
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Ranked according to your profile and eligibility.
            </p>

          </div>

          <Link
            to="/schemes"
            className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-semibold"
          >
            View All

            <ArrowRight className="w-4 h-4" />

          </Link>

        </div>

        {schemes.length === 0 ? (

          <div className="bg-white rounded-2xl border p-10 text-center">

            <Brain className="mx-auto w-12 h-12 text-gray-300 mb-4" />

            <h3 className="text-xl font-semibold text-gray-800">

              No Recommendations Yet

            </h3>

            <p className="text-gray-500 mt-2">

              Complete your profile to receive AI-generated government
              scheme recommendations.

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

            {schemes.slice(0, 6).map((scheme) => (

              <SchemeCard
                key={scheme.scheme_id}
                scheme={scheme}
              />

            ))}

          </div>

        )}

      </div>
            {/* AI Summary */}

      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white">

        <div className="flex items-start gap-4">

          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">

            <Brain className="w-7 h-7" />

          </div>

          <div className="flex-1">

            <h2 className="text-2xl font-bold mb-2">

              AI Recommendation Summary

            </h2>

            <p className="text-sky-100 leading-7">

              Eligify analyzed your profile and compared it against multiple
              government welfare schemes using our AI recommendation engine.
              These schemes are ranked based on eligibility confidence,
              profile matching, and AI reasoning to help you discover the
              benefits you are most likely to receive.

            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

              <div className="bg-white/10 rounded-2xl p-5">

                <p className="text-sky-100 text-sm">

                  Total Recommendations

                </p>

                <h3 className="text-3xl font-bold mt-2">

                  {schemes.length}

                </h3>

              </div>

              <div className="bg-white/10 rounded-2xl p-5">

                <p className="text-sky-100 text-sm">

                  Highest Confidence

                </p>

                <h3 className="text-3xl font-bold mt-2">

                  {highestConfidence.toFixed(1)}%

                </h3>

              </div>

              <div className="bg-white/10 rounded-2xl p-5">

                <p className="text-sky-100 text-sm">

                  Documents Needed

                </p>

                <h3 className="text-3xl font-bold mt-2">

                  {uniqueDocuments.size}

                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
};

export default DashboardPage;