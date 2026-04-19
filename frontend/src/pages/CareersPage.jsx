import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const openings = [
    { title: 'Senior Software Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
    { title: 'Product Manager', department: 'Product', location: 'New York, NY', type: 'Full-time' },
    { title: 'UX Designer', department: 'Design', location: 'Remote', type: 'Full-time' },
    { title: 'Customer Success Manager', department: 'Support', location: 'Remote', type: 'Full-time' },
    { title: 'Marketing Specialist', department: 'Marketing', location: 'New York, NY', type: 'Full-time' },
];

const benefits = [
    { icon: 'health_and_safety', title: 'Health & Wellness', description: 'Comprehensive health, dental, and vision coverage for you and your family.' },
    { icon: 'work_history', title: 'Flexible Work', description: 'Remote-first culture with flexible hours to fit your lifestyle.' },
    { icon: 'school', title: 'Learning & Growth', description: 'Professional development budget and mentorship programs.' },
    { icon: 'savings', title: 'Competitive Pay', description: 'Above-market compensation with equity options.' },
];

export default function CareersPage() {
    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen bg-background-light text-text-light font-display">

                {/* Hero Section */}
                <section className="relative bg-background-dark py-20 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#005a9c] to-[#003d6b] opacity-90"></div>
                    </div>
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 mt-16">
                            Join Our Team
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            Help us revolutionize the gig economy. We're looking for passionate people who want to make a difference.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">

                    {/* Why Join Us */}
                    <section className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Why Join Quick Staff?</h2>
                            <p className="text-subtle-light text-lg max-w-2xl mx-auto">
                                We're building something meaningful and want you to be part of it.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {benefits.map((benefit) => (
                                <div key={benefit.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
                                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 text-primary">
                                        <span className="material-symbols-outlined text-3xl">{benefit.icon}</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                                    <p className="text-subtle-light text-sm">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Open Positions */}
                    <section className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
                            <p className="text-subtle-light text-lg">
                                Find your next opportunity with us.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {openings.map((job, index) => (
                                <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-text-light">{job.title}</h3>
                                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-subtle-light">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-base">apartment</span>
                                                {job.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-base">location_on</span>
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-base">schedule</span>
                                                {job.type}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="bg-primary rounded-3xl p-12 text-center text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't See Your Role?</h2>
                            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                                We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
                            </p>
                            <a href="mailto:careers@quickstaff.com" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
                                Send Your Resume
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
