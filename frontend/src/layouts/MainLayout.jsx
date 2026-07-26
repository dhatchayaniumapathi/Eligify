import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import ToastNotification from "../components/ToastNotification";

const MainLayout = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans antialiased">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>

      <Footer />
      <ToastNotification />
    </div>
  );
};

export default MainLayout;
