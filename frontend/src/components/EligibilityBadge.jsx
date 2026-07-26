import React from "react";
import { CheckCircle, AlertTriangle, XCircle, Sparkles } from "lucide-react";

const EligibilityBadge = ({ eligible, confidence = 1.0, size = "md" }) => {
  const isHigh = confidence >= 0.8;
  const isMed = confidence >= 0.5 && confidence < 0.8;

  if (eligible) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold border shadow-sm ${
          size === "sm"
            ? "px-2.5 py-0.5 text-xs"
            : "px-3 py-1 text-xs sm:text-sm"
        } bg-emerald-50 text-emerald-700 border-emerald-200`}
      >
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        Eligible ({Math.round(confidence * 100)}% Match)
      </span>
    );
  }

  if (isMed) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold border shadow-sm ${
          size === "sm"
            ? "px-2.5 py-0.5 text-xs"
            : "px-3 py-1 text-xs sm:text-sm"
        } bg-amber-50 text-amber-700 border-amber-200`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Partial Match ({Math.round(confidence * 100)}%)
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border shadow-sm ${
        size === "sm"
          ? "px-2.5 py-0.5 text-xs"
          : "px-3 py-1 text-xs sm:text-sm"
      } bg-rose-50 text-rose-700 border-rose-200`}
    >
      <XCircle className="w-3.5 h-3.5 text-rose-600" />
      Not Eligible
    </span>
  );
};

export default EligibilityBadge;
