import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const RegisterSelect = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const presetRole = params.get("role");

  if (presetRole === "client") {
    navigate("/register/client");
  }
  if (presetRole === "worker") {
    navigate("/register/worker");
  }

  return (
    <div className="bg-background-light min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold">Quick Staff</h2>
        </div>
        <Link
          to="/login"
          className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90"
        >
          Login
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="text-center mb-10">
          <p className="text-4xl font-black">Join Quick Staff</p>
          <p className="text-subtle-light max-w-lg">
            Choose your path below. Hire professionals or find your next gig in minutes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="flex flex-col gap-5 text-center p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="text-primary">
              <span className="material-symbols-outlined text-6xl">business_center</span>
            </div>
            <div>
              <p className="text-2xl font-bold">I'm a Client</p>
              <p className="text-subtle-light mt-2">
                Post jobs, find skilled professionals, and manage projects with ease. Get the help you need, on-demand.
              </p>
            </div>
            <Link
              to="/register/client"
              className="h-12 flex items-center justify-center rounded-lg bg-primary text-white font-bold hover:bg-primary/90"
            >
              Register as a Client
            </Link>
          </div>
          <div className="flex flex-col gap-5 text-center p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="text-primary">
              <span className="material-symbols-outlined text-6xl">construction</span>
            </div>
            <div>
              <p className="text-2xl font-bold">I'm a Gig Worker</p>
              <p className="text-subtle-light mt-2">
                Showcase your skills, find flexible work opportunities, and connect with clients looking for your expertise.
              </p>
            </div>
            <Link
              to="/register/worker"
              className="h-12 flex items-center justify-center rounded-lg bg-primary text-white font-bold hover:bg-primary/90"
            >
              Register as a Gig Worker
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterSelect;

