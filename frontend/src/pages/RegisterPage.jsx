import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  phone: "",
  age: "",
  gender: "Female",
  state: "",
  district: "",
  education: "",
  occupation: "",
  annual_income: "",
  category: "General",
  disability: false,
});

  const states = [
    'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
    'Telangana', 'Uttar Pradesh', 'West Bengal',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const field = (key, val) => setForm({ ...form, [key]: val });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">
              Eligify
            </span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Create your free citizen profile</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Get Started</h2>
          <p className="text-xs text-gray-500 mb-6">Fill in your basic details to check eligibility for government schemes.</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" required placeholder="Ananya Sharma"
                  value={form.name}
                  onChange={(e) => field("name", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required placeholder="you@example.com"
                  value={form.email} onChange={(e) => field('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" />
              </div>
            </div>
            <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Phone Number
            </label>

            <input
              type="tel"
              required
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) => field("phone", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Age</label>
                <input type="number" min="1" max="120" required placeholder="24"
                  value={form.age} onChange={(e) => field('age', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gender</label>
                <select value={form.gender} onChange={(e) => field('gender', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all">
                  <option>Female</option>
                  <option>Male</option>
                  <option>Transgender</option>
                </select>
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">State of Residence</label>
              <select required value={form.state} onChange={(e) => field('state', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all">
                <option value="">Select your state</option>
                {states.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                District
              </label>

              <input
                type="text"
                required
                placeholder="Chennai"
                value={form.district}
                onChange={(e) => field("district", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Education
              </label>

              <input
                type="text"
                required
                placeholder="B.Tech AI & DS"
                value={form.education}
                onChange={(e) => field("education", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>

            <div>
  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
    Occupation
  </label>

  <input
    type="text"
    required
    placeholder="Student"
    value={form.occupation}
    onChange={(e) => field("occupation", e.target.value)}
    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
  />
</div>
<div>
  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
    Annual Income (₹)
  </label>

  <input
    type="number"
    min="0"
    required
    placeholder="150000"
    value={form.annual_income}
    onChange={(e) => field("annual_income", e.target.value)}
    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
  />
</div>
<div>
  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
    Category
  </label>

  <select
    value={form.category}
    onChange={(e) => field("category", e.target.value)}
    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
  >
    <option>General</option>
    <option>SC</option>
    <option>ST</option>
    <option>OBC</option>
    <option>EWS</option>
  </select>
</div>

{/* Disability Check */}
<div className="space-y-2">
  <label className="block text-xs font-semibold text-gray-700 mb-2">
    Do you have any disability?
  </label>

  <div className="flex items-center gap-6">
    <button
      type="button"
      onClick={() => field("disability", true)}
      className={`px-4 py-2 text-sm rounded-lg border transition-all ${
        form.disability
          ? "bg-green-50 border-green-400 text-green-700"
          : "bg-gray-50 border-gray-200 text-gray-600"
      }`}
    >
      Yes
    </button>

    <button
      type="button"
      onClick={() => field("disability", false)}
      className={`px-4 py-2 text-sm rounded-lg border transition-all ${
        !form.disability
          ? "bg-red-50 border-red-400 text-red-700"
          : "bg-gray-50 border-gray-200 text-gray-600"
      }`}
    >
      No
    </button>
  </div>
</div>    
            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} required placeholder="Create a secure password"
                  value={form.password} onChange={(e) => field('password', e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-60 transition-all mt-2">
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
