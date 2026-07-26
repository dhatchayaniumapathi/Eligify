import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ToastNotification = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
  };

  const borders = {
    success: "border-emerald-500/30 bg-emerald-50 text-emerald-900",
    error: "border-rose-500/30 bg-rose-50 text-rose-900",
    info: "border-sky-500/30 bg-sky-50 text-sky-900",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short max-w-md">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md transition-all ${
          borders[toast.type] || borders.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium pr-2">{toast.message}</p>
      </div>
    </div>
  );
};

export default ToastNotification;
