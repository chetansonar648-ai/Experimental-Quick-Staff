import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import BrowseStaff from "./pages/BrowseStaff";
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";
import SavedWorkers from "./pages/SavedWorkers";
import StaffProfile from "./pages/StaffProfile";

import Profile from "./pages/Profile";
import BookStep1 from "./pages/BookStep1";
import BookStep2 from "./pages/BookStep2";
import BookStep3 from "./pages/BookStep3";
import BookConfirm from "./pages/BookConfirm";

const Placeholder = ({ label }) => {
  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="text-gray-600 dark:text-gray-300">
        {label} page layout will go here, matching your provided UI.
      </div>
    </main>
  );
};

const App = () => {
  return (
    <div className="relative flex h-screen min-h-screen w-full flex-col overflow-hidden">
      <div className="flex h-full w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="browse-staff" element={<BrowseStaff />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="saved-workers" element={<SavedWorkers />} />
            <Route path="saved-workers" element={<SavedWorkers />} />
            <Route path="profile" element={<Profile />} />
            <Route path="staff/:id" element={<StaffProfile />} />

            <Route path="book/step-1" element={<BookStep1 />} />
            <Route path="book/step-2" element={<BookStep2 />} />
            <Route path="book/step-3" element={<BookStep3 />} />
            <Route path="book/confirm" element={<BookConfirm />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;


