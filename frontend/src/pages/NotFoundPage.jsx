import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 rounded-3xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-6">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black text-sky-600 mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-900 mb-3">Page Not Found</h2>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white font-semibold text-sm rounded-xl shadow-md shadow-sky-500/20 hover:bg-sky-700 transition-colors">
          <Home className="w-4 h-4" /> Back to Home
        </Link>
        <Link to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Go to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
