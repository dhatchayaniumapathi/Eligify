import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProfileCard from '../components/ProfileCard';
import SchemeCard from '../components/SchemeCard';
import { useAuth } from '../context/AuthContext';
import { schemeService, activityService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Sparkles, FileCheck, TrendingUp, Award, Clock,
  ArrowRight, UserCheck, Bookmark, FileText,
} from 'lucide-react';

const activityIcons = { UserCheck, Sparkles, FileCheck: FileCheck, Bookmark };

const DashboardPage = () => {
  const { user } = useAuth();
  const [eligibility, setEligibility] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [eli, acts] = await Promise.all([
          schemeService.checkEligibility(),
          activityService.getRecentActivities(),
        ]);
        setEligibility(eli);
        setActivities(acts);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <MainLayout><LoadingSpinner fullScreen label="Loading your dashboard..." /></MainLayout>;

  const topSchemes = eligibility?.recommendations?.slice(0, 3) || [];

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Welcome back, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Here's your personalised welfare eligibility overview.
        </p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Eligibility Score</span>
            <TrendingUp className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-sky-700">{eligibility?.overall_score}%</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">High Match Index</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Matched Schemes</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{eligibility?.total_matched}</p>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">Fully Eligible</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">OCR Verification</span>
            <FileCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-700">100%</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Aadhaar Verified</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Total Benefits</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-700">₹6.3L</p>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">Potential Annual Value</p>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="mb-6">
        <ProfileCard user={user} />
      </div>

      {/* Top Recommendations */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Top Eligible Schemes</h2>
          <Link to="/schemes" className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {topSchemes.map((s) => <SchemeCard key={s.scheme_id} scheme={s} />)}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" /> Recent Activity
        </h3>
        <div className="space-y-3">
          {activities.map((act) => {
            const Icon = activityIcons[act.icon] || FileText;
            return (
              <div key={act.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{act.action}</p>
                  <p className="text-xs text-gray-500">{act.detail}</p>
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">{act.timestamp}</span>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
