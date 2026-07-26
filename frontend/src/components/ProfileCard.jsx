import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  MapPin,
  Briefcase,
  DollarSign,
  GraduationCap,
  BadgeCheck,
  Edit3,
  ShieldCheck,
} from "lucide-react";

const ProfileCard = ({ user, onEdit }) => {
  if (!user) return null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-sky-500/20">
            {user.name?.charAt(0) || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
              </span>
            </div>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        {onEdit ? (
          <button
            onClick={onEdit}
            className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <Link
            to="/profile"
            className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <Edit3 className="w-4 h-4" /> Edit
          </Link>
        )}
      </div>

      {/* Grid of Profile Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
        <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-sky-600" /> Age & Gender
          </p>
          <p className="text-sm font-bold text-gray-800">
            {user.age} yrs, {user.gender}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Annual Income
          </p>
          <p className="text-sm font-bold text-emerald-800">
            ₹ {Number(user.annual_income || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Jurisdiction
          </p>
          <p className="text-sm font-bold text-gray-800">
          {user.district}, {user.state}
        </p>
        </div>

        <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-purple-600" /> Occupation
          </p>
          <p className="text-sm font-bold text-gray-800">{user.occupation}</p>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
        <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5 text-amber-600" /> Social Category
          </p>
          <p className="text-xs font-semibold text-gray-700">{user.category}</p>
        </div>

        <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Education
          </p>
          <p className="text-xs font-semibold text-gray-700">{user.education}</p>
        </div>

        <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100 col-span-2 sm:col-span-1">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
            Disability Status
          </p>
          <p className="text-xs font-semibold text-gray-700">
            {user.disability ? "Yes (40%+ Benchmark)" : "None"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
