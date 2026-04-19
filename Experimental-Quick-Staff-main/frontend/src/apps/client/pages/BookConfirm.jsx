import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import defaultWorkerAvatar from "../../../assets/worker_default_avatar.png";

const BookConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { worker, serviceLocation, total, formattedDate, bookingReference } = location.state || {};

  // Ensure we have data, otherwise redirect
  useEffect(() => {
    if (!worker || !total) {
      navigate("/client/browse-staff");
    }
  }, [worker, total, navigate]);

  if (!worker) return null;

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-900/50 p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center size-20 bg-green-100 dark:bg-green-900/50 rounded-full">
              <span className="material-symbols-outlined text-5xl text-green-500 dark:text-green-400">task_alt</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Your service has been successfully booked. The worker has been notified.</p>

          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-full text-sm mb-8">
            <span className="font-medium text-gray-700 dark:text-gray-300">Booking ID:</span>
            <span className="font-mono text-gray-900 dark:text-white">{bookingReference}</span>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg text-left space-y-6">
            <div className="flex items-center gap-4">
              <img
                alt={worker.name}
                className="size-16 rounded-full object-cover border-2 border-white dark:border-gray-800"
                src={worker.image_url || defaultWorkerAvatar}
                onError={(e) => { e.target.src = defaultWorkerAvatar; }}
              />
              <div className="flex-grow">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">{worker.name}</h4>
                <p className="text-primary font-medium">{worker.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{formattedDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{serviceLocation}</p>
              </div>

            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/client/bookings")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors w-full"
            >
              <span className="material-symbols-outlined">list_alt</span>
              <span>View My Bookings</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors w-full">
              <span className="material-symbols-outlined">event</span>
              <span>Add to Calendar</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookConfirm;

