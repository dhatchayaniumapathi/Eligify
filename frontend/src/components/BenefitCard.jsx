import React from "react";
import { Gift, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";

const BenefitCard = ({ title, amount, description, tag = "Direct Benefit" }) => {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-sky-50/40 border border-sky-100/80 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
          {tag}
        </span>
        <Gift className="w-5 h-5 text-sky-600" />
      </div>
      <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-lg font-extrabold text-sky-700 mb-2">{amount}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
};

export default BenefitCard;
