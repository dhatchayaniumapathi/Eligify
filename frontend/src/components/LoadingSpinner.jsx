import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ label = "Loading data...", fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-sky-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-700">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className="w-8 h-8 text-sky-600 animate-spin mb-2" />
      <p className="text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
