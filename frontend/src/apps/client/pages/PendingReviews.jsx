import React from "react";
import { NavLink } from "react-router-dom";

const PendingReviews = () => {
  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
      <BookingsTabs />
      {/* Content copied from Pending Reviews UI */}
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
      <TabLink to="/bookings/reviews" icon="rate_review" label="Pending Reviews" badge="3" primary />
      <TabLink to="/payments/upcoming" icon="schedule" label="Upcoming Payments" badge="2" />
      <TabLink to="/payments/history" icon="receipt_long" label="Payment History" />
    </nav>
  );
};

const TabLink = ({ to, icon, label, badge, primary }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "shrink-0 px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2",
          isActive || primary
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

export default PendingReviews;


