import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  FileCheck,
  User,
  Info,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { name: "Overview Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Eligible Schemes", path: "/recommendations", icon: Sparkles, badge: "4 Qualified" },
    { name: "OCR Verification", path: "/ocr-upload", icon: FileCheck, badge: "Verified" },
    { name: "Profile & Settings", path: "/profile", icon: User },
    { name: "About Eligify", path: "/about", icon: Info },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] p-4 hidden lg:block flex-shrink-0">
      {/* User Mini Summary */}
      {user && (
        <div className="p-3.5 mb-6 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50/50 border border-sky-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center shadow-sm">
              {user.full_name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-gray-900 truncate">
                {user.full_name}
              </h4>
              <p className="text-xs text-gray-500 truncate">{user.state}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-sky-700 pt-2 border-t border-sky-100 font-medium">
            <span>Eligibility Index</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              92% High
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">
          Navigation
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-sky-600 text-white shadow-md shadow-sky-500/20 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-gray-400"}`} />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Help & Support Card */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-sky-900 text-white">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase mb-1">
          <ShieldAlert className="w-4 h-4" /> Help Center
        </div>
        <h5 className="text-sm font-bold mb-1">Need assistance?</h5>
        <p className="text-xs text-indigo-200 mb-3 leading-relaxed">
          Contact official portal helpline or check scheme guidelines.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 hover:text-white transition-colors"
        >
          View FAQs & Guides <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
