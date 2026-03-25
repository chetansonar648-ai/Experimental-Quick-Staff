import React from "react";
import { NavLink } from "react-router-dom";

const ActiveBookings = () => {
  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      <BookingsTabs />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search by worker, service..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select className="w-full sm:w-auto pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary text-sm">
            <option>All Services</option>
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Cleaning</option>
          </select>
          <select className="w-full sm:w-auto pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary text-sm">
            <option>All Statuses</option>
            <option>Worker En Route</option>
            <option>In Progress</option>
            <option>Awaiting Arrival</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Cards copied from Active Bookings UI (static content) */}
      </div>
    </main>
  );
};

const BookingsTabs = () => {
  return (
    <nav aria-label="Tabs" className="flex flex-wrap -mb-px border-b border-gray-200 dark:border-gray-700">
      <TabLink to="/bookings/upcoming" icon="event_upcoming" label="Upcoming Bookings" badge="3" />
      <TabLink to="/bookings/active" icon="work" label="Active Bookings" badge="5" />
      <TabLink to="/bookings/requested" icon="hourglass_top" label="Requested Bookings" badge="2" />
      <TabLink to="/bookings/completed" icon="history" label="Past Bookings" />
      <TabLink to="/bookings/completed" icon="task_alt" label="Completed Jobs" badge="22" />
      <TabLink to="/bookings/cancelled" icon="cancel" label="Cancelled Jobs" />
      <TabLink to="/bookings/reviews" icon="rate_review" label="Pending Reviews" badge="3" />
      <TabLink to="/payments/upcoming" icon="schedule" label="Upcoming Payments" badge="2" />
      <TabLink to="/payments/history" icon="receipt_long" label="Payment History" />
    </nav>
  );
};

const TabLink = ({ to, icon, label, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "shrink-0 px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2",
          isActive
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600",
        ].join(" ")
      }
    >
      <span className="material-symbols-outlined text-base">{icon}</span>
      {label}
      {badge && (
        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export default ActiveBookings;


