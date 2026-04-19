import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const clientSteps = [
  { step: '01', icon: 'edit_document', title: 'Post a Job', body: 'Describe your needs, specify skills, and set your budget in a simple form.' },
  { step: '02', icon: 'group', title: 'Review & Connect', body: 'Receive applications, browse profiles, and chat directly with candidates.' },
  { step: '03', icon: 'payments', title: 'Hire & Pay Securely', body: 'Hire with confidence. Funds are held until the job is completed.' }
];

const workerSteps = [
  { step: '01', icon: 'person', title: 'Create Your Profile', body: 'Showcase your skills, experience, and availability to stand out.' },
  { step: '02', icon: 'work', title: 'Find & Apply for Jobs', body: 'Browse matching jobs and apply in a few clicks. Chat with clients.' },
  { step: '03', icon: 'paid', title: 'Get Paid Quickly', body: 'Complete work and get paid promptly through our secure system.' }
];

const StepCard = ({ item, colorClass, stepClass }) => (
  <div className="relative bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className={`text-6xl font-black opacity-5 absolute top-4 right-6 ${stepClass}`}>
      {item.step}
    </div>
    <div className={`w-14 h-14 rounded-full ${colorClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <span className="material-symbols-outlined text-2xl">{item.icon}</span>
    </div>
    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
    <p className="text-subtle-light leading-relaxed">{item.body}</p>
  </div>
);

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <div className="flex flex-col min-h-screen bg-white text-text-light font-display">

        {/* Header */}
        <section className="bg-background-light py-20 px-4 text-center border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 tracking-tight">How It Works</h1>
            <p className="text-xl text-subtle-light max-w-2xl mx-auto">
              Your step-by-step guide to hiring top talent and finding your next gig.
            </p>
          </div>
        </section>

        {/* Section: For Clients */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-12">
            <div className="bg-blue-100 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">For Clients</div>
            <h2 className="text-3xl font-bold">Find the perfect staff in minutes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clientSteps.map((step) => (
              <StepCard
                key={step.title}
                item={step}
                colorClass="bg-blue-50 text-primary"
                stepClass="text-blue-900"
              />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100"></div>

        {/* Section: For Workers */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-slate-50">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-12">
            <div className="bg-green-100 text-secondary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">For Gig Workers</div>
            <h2 className="text-3xl font-bold">Earn money on your own schedule</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workerSteps.map((step) => (
              <StepCard
                key={step.title}
                item={step}
                colorClass="bg-green-50 text-secondary"
                stepClass="text-green-900"
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 text-center bg-primary text-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-blue-100 text-lg mb-10">
              Join our community of skilled workers and top clients today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register/client" className="btn bg-white text-primary border-none hover:bg-gray-100 px-8 py-3 rounded-xl font-bold shadow-lg">
                I want to HIRE
              </Link>
              <Link to="/register/worker" className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl font-bold shadow-sm">
                I want to WORK
              </Link>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </section>

      </div>
    </PublicLayout>
  );
}
