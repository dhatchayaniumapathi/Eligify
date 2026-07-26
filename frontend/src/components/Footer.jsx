import React from "react";
import { ShieldCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-gray-900">Eligify</span>
            <span className="text-xs text-gray-500">
              — AI Welfare Eligibility Platform
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-gray-500">
            <Link to="/" className="hover:text-sky-600 transition-colors">
              Home
            </Link>
            <Link to="/schemes" className="hover:text-sky-600 transition-colors">
              Scheme Directory
            </Link>
            <Link to="/ocr" className="hover:text-sky-600 transition-colors">
              OCR Verification
            </Link>
            <Link to="/about" className="hover:text-sky-600 transition-colors">
              About Platform
            </Link>
          </div>

          <p className="text-xs text-gray-400 flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Hackathon 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
