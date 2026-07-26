import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../context/AuthContext';
import { Save, User, MapPin, Briefcase, GraduationCap, DollarSign, BadgeCheck, Accessibility } from 'lucide-react';

const STATES = [
  'All', 'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'West Bengal',
];
const CATEGORIES = ['General', 'SC', 'ST', 'OBC', 'Minority'];
const OCCUPATIONS = ['Farmer', 'Student', 'Unemployed', 'Self-Employed', 'Artisan', 'Senior Citizen', 'Other'];
const EDUCATIONS = ['Below 10th', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate'];

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [form, setForm] = useState({ ...(user || {}) });
  const [saved, setSaved] = useState(false);

  const field = (key, val) => {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateUserProfile({ ...form, age: Number(form.age), annual_income: Number(form.annual_income) });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = 'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all';
  const labelCls = 'block text-xs font-semibold text-gray-700 mb-1.5';

  return (
    <MainLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update your demographic details to improve eligibility accuracy.</p>
        </div>

        {/* Live Preview Card */}
        <div className="mb-6">
          <ProfileCard user={form} />
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-sky-600" /> Edit Personal Details
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Row 1 — Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <input type="text" value={form.full_name || ''} onChange={(e) => field('full_name', e.target.value)}
                  className={inputCls} placeholder="Full name" />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <input type="email" value={form.email || ''} onChange={(e) => field('email', e.target.value)}
                  className={inputCls} placeholder="Email" />
              </div>
            </div>

            {/* Row 2 — Age & Gender */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}><User className="w-3 h-3 inline mr-1" />Age (years)</label>
                <input type="number" min="1" max="120" value={form.age || ''} onChange={(e) => field('age', e.target.value)}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Gender</label>
                <select value={form.gender || 'Female'} onChange={(e) => field('gender', e.target.value)} className={inputCls}>
                  {['Female', 'Male', 'Transgender'].map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}><BadgeCheck className="w-3 h-3 inline mr-1" />Social Category</label>
                <select value={form.category || 'General'} onChange={(e) => field('category', e.target.value)} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Row 3 — State & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><MapPin className="w-3 h-3 inline mr-1" />State of Residence</label>
                <select value={form.state || ''} onChange={(e) => field('state', e.target.value)} className={inputCls}>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>District</label>
                <input type="text" value={form.district || ''} onChange={(e) => field('district', e.target.value)}
                  className={inputCls} placeholder="e.g. Bhopal" />
              </div>
            </div>

            {/* Row 4 — Income & Occupation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><DollarSign className="w-3 h-3 inline mr-1" />Annual Family Income (Rs.)</label>
                <input type="number" min="0" value={form.annual_income || ''} onChange={(e) => field('annual_income', e.target.value)}
                  className={inputCls} placeholder="150000" />
              </div>
              <div>
                <label className={labelCls}><Briefcase className="w-3 h-3 inline mr-1" />Primary Occupation</label>
                <select value={form.occupation || ''} onChange={(e) => field('occupation', e.target.value)} className={inputCls}>
                  {OCCUPATIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Row 5 — Education & Disability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><GraduationCap className="w-3 h-3 inline mr-1" />Highest Education</label>
                <select value={form.education || 'Graduate'} onChange={(e) => field('education', e.target.value)} className={inputCls}>
                  {EDUCATIONS.map((ed) => <option key={ed}>{ed}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}><Accessibility className="w-3 h-3 inline mr-1" />Disability Status</label>
                <select value={form.disability ? 'yes' : 'no'} onChange={(e) => field('disability', e.target.value === 'yes')} className={inputCls}>
                  <option value="no">No Benchmark Disability</option>
                  <option value="yes">Yes — 40% or above disability</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-500/20 flex items-center gap-2 transition-all">
                <Save className="w-4 h-4" /> Save Profile
              </button>
              {saved && <span className="text-xs font-semibold text-emerald-600">✓ Profile saved successfully!</span>}
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
