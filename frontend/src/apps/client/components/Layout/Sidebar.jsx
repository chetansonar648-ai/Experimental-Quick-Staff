import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext.jsx";

const navLinkBase =
  "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 font-medium";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="flex items-center gap-4 text-gray-900 dark:text-white px-6 h-16 border-b border-gray-200 dark:border-gray-800">
        <div className="size-6 text-primary">
          <span className="material-symbols-outlined text-3xl">hub</span>
        </div>
        <h2 className="text-lg font-bold tracking-tight">Quick Staff</h2>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/client"
              end
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? "bg-primary/10 text-primary font-semibold" : ""}`
              }
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/client/browse-staff"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? "bg-primary/10 text-primary font-semibold" : ""}`
              }
            >
              <span className="material-symbols-outlined">search</span>
              <span>Browse Staff</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/client/bookings"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? "bg-primary/10 text-primary font-semibold" : ""}`
              }
            >
              <span className="material-symbols-outlined">calendar_month</span>
              <span>My Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/client/saved-workers"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? "bg-primary/10 text-primary font-semibold" : ""}`
              }
            >
              <span className="material-symbols-outlined">bookmark</span>
              <span>Saved Workers</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/client/profile"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? "bg-primary/10 text-primary font-semibold" : ""}`
              }
            >
              <span className="material-symbols-outlined">person</span>
              <span>My Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 font-medium"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


