import React from "react";
import { Link } from "react-router-dom";

const PublicLayout = ({ children }) => {
  return (
    <div className="bg-background-light text-text-light min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-background-light/80 backdrop-blur border-b border-border-light">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-3">
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
            <h2 className="text-lg font-bold tracking-tight">Quick Staff Hiring Portal</h2>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-primary" to="/#categories">
              Staff Categories
            </Link>
            <Link className="text-sm font-medium hover:text-primary" to="/#how">
              How It Works
            </Link>
            <Link className="text-sm font-medium hover:text-primary" to="/#about">
              About Us
            </Link>
            <div className="flex gap-2">
              <Link
                to="/register"
                className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-gray-200 text-text-light text-sm font-bold hover:bg-gray-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase">Company</h3>
              <ul className="space-y-2 text-sm text-subtle-light">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase">Support</h3>
              <ul className="space-y-2 text-sm text-subtle-light">
                <li>FAQ</li>
                <li>Help Center</li>
                <li>Trust & Safety</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase">Legal</h3>
              <ul className="space-y-2 text-sm text-subtle-light">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase">Connect</h3>
              <div className="flex gap-4 text-subtle-light">FB · TW</div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-subtle-light">
            © 2026 Quick Staff Hiring Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

