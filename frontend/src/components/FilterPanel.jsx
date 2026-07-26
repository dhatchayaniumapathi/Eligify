import React from "react";
import { Filter, RotateCcw, Check } from "lucide-react";

const FilterPanel = ({ filters, onChange, onReset }) => {
  const states = [
    "All",
    "Tamil Nadu",
    "Madhya Pradesh",
    "Karnataka",
    "Maharashtra",
    "West Bengal",
    "Telangana",
    "Uttar Pradesh",
    "Delhi",
  ];

  const categories = ["All", "General", "SC", "ST", "OBC", "Minority"];

  const occupations = [
    "All",
    "Farmer",
    "Student",
    "Unemployed",
    "Self-Employed",
    "Artisan",
    "Senior Citizen",
  ];

  const genders = ["All", "Female", "Male", "Transgender"];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-600" /> Filter Schemes
        </h4>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-gray-500 hover:text-sky-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* State Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          State Jurisdiction
        </label>
        <select
          value={filters.state || "All"}
          onChange={(e) => onChange("state", e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
        >
          {states.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Occupation Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Occupation Group
        </label>
        <select
          value={filters.occupation || "All"}
          onChange={(e) => onChange("occupation", e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
        >
          {occupations.map((occ) => (
            <option key={occ} value={occ}>
              {occ}
            </option>
          ))}
        </select>
      </div>

      {/* Social Category Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Social Category
        </label>
        <select
          value={filters.category || "All"}
          onChange={(e) => onChange("category", e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Gender Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Target Gender
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {genders.map((g) => {
            const active = (filters.gender || "All") === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => onChange("gender", g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border text-center transition-all ${
                  active
                    ? "bg-sky-600 text-white border-sky-600 font-semibold"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
