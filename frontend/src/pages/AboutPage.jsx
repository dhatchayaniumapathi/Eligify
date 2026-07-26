import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { ShieldCheck, Sparkles, FileCheck, Users, Code2, Github, ExternalLink } from 'lucide-react';

const AboutPage = () => {
  const stack = [
    { layer: 'Frontend', tech: 'React 18, Vite, Tailwind CSS, React Router, Lucide Icons' },
    { layer: 'Backend API', tech: 'FastAPI (Python 3.11+), Pydantic v2, SQLAlchemy, Uvicorn' },
    { layer: 'Database', tech: 'PostgreSQL, Alembic Migrations, Asyncpg' },
    { layer: 'AI Engine', tech: 'Rule-Based Evaluator, Confidence Scoring, Explainability Engine' },
    { layer: 'OCR Module', tech: 'EasyOCR, PyTesseract, OpenCV, Pillow, Regex Field Parser' },
  ];

  const features = [
    { icon: Sparkles, title: 'Rule-Based Eligibility Matching', desc: 'Deterministic multi-condition engine evaluating 8 eligibility criteria per scheme.' },
    { icon: FileCheck, title: 'OCR Document Verification', desc: 'Auto-extract and cross-verify credentials from Aadhaar, Income & Caste certificates.' },
    { icon: ShieldCheck, title: 'Transparent Explainability', desc: 'Every decision comes with matched/failed condition reasoning and confidence scores.' },
    { icon: Users, title: '20+ Government Schemes', desc: 'Central and State-level welfare schemes curated with realistic eligibility criteria.' },
  ];

  return (
    <MainLayout showSidebar={false}>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-3xl border border-sky-100 p-8 md:p-12 mb-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/25">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">About Eligify</h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Eligify is an AI-powered Government Scheme Eligibility & Recommendation Platform built for Hackathon 2026.
          We connect citizens directly with welfare schemes they genuinely qualify for — with full transparency and zero complexity.
        </p>
      </section>

      {/* Features Grid */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">Core Platform Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">Technology Stack</h2>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
            <Code2 className="w-4 h-4 text-sky-600" /> Full-Stack Architecture
          </div>
          <div className="space-y-3">
            {stack.map(({ layer, tech }) => (
              <div key={layer} className="flex flex-col sm:flex-row gap-2 py-3 border-b border-gray-50 last:border-0">
                <dt className="w-32 text-xs font-bold text-sky-700 flex-shrink-0 uppercase tracking-wide">{layer}</dt>
                <dd className="text-xs text-gray-600">{tech}</dd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="text-center py-8 border-t border-gray-100">
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Built by Team Eligify</h2>
        <p className="text-sm text-gray-500 mb-4">Hackathon 2026 Submission — AI-Powered Citizen Welfare Platform</p>
        <div className="flex items-center justify-center gap-3">
          <a href="https://github.com/dhatchayaniumapathi/Eligify" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-700 transition-colors">
            <Github className="w-4 h-4" /> View on GitHub
          </a>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
