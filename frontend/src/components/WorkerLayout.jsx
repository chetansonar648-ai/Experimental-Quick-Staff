import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const WorkerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div className="bg-background-light text-[#111618] min-h-screen flex">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col overflow-hidden border-r border-gray-200 bg-white md:flex">
        <Link to="/" className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="size-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight">Quick Staff</h2>
        </Link>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { to: "/worker/dashboard", label: "Dashboard" },
            { to: "/worker/jobs", label: "My Jobs" },
            { to: "/worker/saved-clients", label: "Saved Clients" },
            { to: "/worker/profile", label: "Profile" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary/90"
          >
            Logout
          </button>
        </div>
      </aside>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:ml-64">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <h2 className="font-bold">Quick Staff</h2>
          </Link>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto bg-background-light px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
};

export default WorkerLayout;

