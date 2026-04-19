import React from "react";
import PublicLayout from "../components/PublicLayout.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <PublicLayout>
      <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-10 md:py-16">
          <div className="p-4">
            <div
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-6 text-center"
              id="hero"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLJd94Q3F3xSI8LUeqAMSI876PsjZ5qnD5XGmcOk_WQ5iNZXmp5yOHXWB_Bs_Naf_-WFGdxjIGoCUD5O0x_17RRskl3CG8nKaYnQnb8Sv2uBbi0NaHXmaJ6vyOyaCaawPGa57qssUEXYzst25EuhsNruaX_sgPbPm6Hgw1VDE0LfC_u9yC2YTPpshCAaLWanY9BEktseT27D1hiB2TZcsFz7GIpXg0gTdfAK15jbFK5yHiCbaVcEMyOyMXOMpboK9eGXeWaK2fvA")',
              }}
            >
              <div className="flex flex-col gap-3 text-center max-w-3xl">
                <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
                  The Fastest Way to Hire On-Demand Staff
                </h1>
                <p className="text-white/90 text-lg">
                  Connect with skilled gig workers or find your next job in minutes.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/register?role=client"
                  className="flex min-w-[84px] items-center justify-center rounded-lg h-12 px-5 bg-primary text-white text-base font-bold hover:bg-primary/90"
                >
                  I want to HIRE
                </Link>
                <Link
                  to="/register?role=worker"
                  className="flex min-w-[84px] items-center justify-center rounded-lg h-12 px-5 bg-background-light text-text-light text-base font-bold hover:bg-gray-200"
                >
                  I want to WORK
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="py-10 md:py-16">
          <h2 className="text-3xl font-bold text-center pb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "person_add",
                title: "Create Profile / Post Job",
                text: "Sign up in minutes and tell us what you're looking for or what skills you offer.",
              },
              {
                icon: "search",
                title: "Browse & Connect",
                text: "Search for available jobs or browse profiles of talented workers that fit your needs.",
              },
              {
                icon: "task_alt",
                title: "Get Hired / Work Done",
                text: "Securely message, agree on terms, and complete the job. It's that simple.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center"
              >
                <span className="material-symbols-outlined text-4xl text-primary">{item.icon}</span>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-sm text-subtle-light">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="categories" className="py-10 md:py-16">
          <h2 className="text-3xl font-bold text-center pb-8">Featured Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              "celebration|Event Staff",
              "restaurant_menu|Hospitality",
              "warehouse|Warehouse",
              "security|Security",
              "liquor|Bartenders",
              "campaign|Promoters",
              "cleaning_services|Cleaners",
              "construction|General Labor",
            ].map((entry) => {
              const [icon, label] = entry.split("|");
              return (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow"
                >
                  <span className="material-symbols-outlined text-4xl text-secondary">{icon}</span>
                  <span className="text-base font-bold">{label}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default Home;

