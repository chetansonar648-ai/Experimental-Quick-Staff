import React, { useEffect, useState } from "react";
import WorkerLayout from "../components/WorkerLayout.jsx";
import { fetchBookings, updateBookingStatus } from "../api/client.js";

const tabs = ["pending", "accepted", "in_progress", "completed", "cancelled", "rejected"];

const WorkerJobs = () => {
  const [bookings, setBookings] = useState([]);
  const [active, setActive] = useState("pending");

  useEffect(() => {
    const load = async () => {
      const data = await fetchBookings();
      setBookings(data);
    };
    load();
  }, []);

  const changeStatus = async (id, status) => {
    await updateBookingStatus(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const filtered = bookings.filter((b) => b.status === active);

  return (
    <WorkerLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Jobs</h1>
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-4 py-2 rounded-lg border ${
                active === tab ? "border-primary text-primary bg-primary/10" : "border-gray-200"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {filtered.map((job) => (
            <div key={job.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-semibold">{job.service_name}</p>
                <p className="text-sm text-gray-500">{new Date(job.booking_date).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Client: {job.client_name}</p>
              </div>
              <div className="flex gap-2">
                {active === "pending" && (
                  <>
                    <button
                      className="px-3 py-2 rounded-lg border border-gray-200"
                      onClick={() => changeStatus(job.id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-2 rounded-lg border border-gray-200"
                      onClick={() => changeStatus(job.id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
                {active === "accepted" && (
                  <button className="px-3 py-2 rounded-lg border border-gray-200" onClick={() => changeStatus(job.id, "in_progress")}>
                    Start
                  </button>
                )}
                {active === "in_progress" && (
                  <button className="px-3 py-2 rounded-lg border border-gray-200" onClick={() => changeStatus(job.id, "completed")}>
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
          {!filtered.length && <div className="px-6 py-6 text-sm text-gray-500">No jobs in this state.</div>}
        </div>
      </div>
    </WorkerLayout>
  );
};

export default WorkerJobs;

