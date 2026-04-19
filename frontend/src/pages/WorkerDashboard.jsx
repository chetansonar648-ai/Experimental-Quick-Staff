import React, { useEffect, useState } from "react";
import WorkerLayout from "../components/WorkerLayout.jsx";
import { fetchBookings, fetchMyServices } from "../api/client.js";

const WorkerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, s] = await Promise.all([fetchBookings(), fetchMyServices()]);
        setBookings(b);
        setServices(s);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    load();
  }, []);

  const stats = [
    { label: "Total Earnings", value: "$1,250.00", delta: "5.2% this month" },
    { label: "Jobs Completed", value: "15", delta: "2 this week" },
    { label: "Average Rating", value: "4.8", delta: "+0.1 from last job" },
  ];

  return (
    <WorkerLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="text-4xl font-black tracking-tight min-w-72">Welcome back!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((item) => (
            <div key={item.label} className="p-6 bg-white rounded-xl border border-gray-200 flex flex-col gap-2">
              <p className="text-base font-medium text-gray-700">{item.label}</p>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-positive text-sm font-medium flex items-center gap-1">{item.delta}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex border-b border-gray-200 px-6 gap-8">
            <div className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary pb-3 pt-4">
              <p className="text-sm font-bold">Scheduled Jobs</p>
            </div>
            <div className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 pb-3 pt-4">
              <p className="text-sm font-bold">Job History</p>
            </div>
          </div>
          <div className="flex flex-col divide-y divide-gray-200">
            {bookings.map((job) => (
              <div key={job.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="size-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-base font-medium line-clamp-1">{job.service_name}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {new Date(job.booking_date).toLocaleString()} • {job.status}
                    </p>
                  </div>
                </div>
                <button className="h-9 px-4 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200">
                  View Details
                </button>
              </div>
            ))}
            {!bookings.length && (
              <div className="px-6 py-6 text-sm text-gray-500">No scheduled jobs yet. Check back soon.</div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">My Services</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.id} className="p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-600">{s.description}</p>
                <p className="text-sm font-medium text-primary">${s.price}</p>
              </div>
            ))}
            {!services.length && <p className="text-sm text-gray-500">No services attached yet.</p>}
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
};

export default WorkerDashboard;

