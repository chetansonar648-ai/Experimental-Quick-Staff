import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const safetyFeatures = [
    { icon: 'verified_user', title: 'Identity Verification', description: 'All users undergo identity verification to ensure you\'re connecting with real people.' },
    { icon: 'fact_check', title: 'Background Checks', description: 'Workers can opt into background checks for additional credibility with clients.' },
    { icon: 'star', title: 'Ratings & Reviews', description: 'Transparent feedback system helps you make informed decisions about who you work with.' },
    { icon: 'shield', title: 'Secure Payments', description: 'All transactions are processed securely with fraud protection measures in place.' },
    { icon: 'support_agent', title: '24/7 Support', description: 'Our safety team is available around the clock to address any concerns.' },
    { icon: 'lock', title: 'Data Protection', description: 'Your personal information is encrypted and never shared without your consent.' },
];

const guidelines = [
    { title: 'Communicate Through the Platform', description: 'Keep all job-related communication within Quick Staff to maintain a record and ensure your safety.' },
    { title: 'Meet in Public Places', description: 'For initial meetings, choose public locations. Trust your instincts if something feels off.' },
    { title: 'Verify Before You Commit', description: 'Check profiles, ratings, and reviews before agreeing to work with someone new.' },
    { title: 'Report Suspicious Activity', description: 'If you encounter any concerning behavior, report it immediately through our platform.' },
];

export default function TrustSafetyPage() {
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
                            Trust & Safety
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            Your safety is our priority. Learn about the measures we take to create a secure platform for everyone.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">

                    {/* Safety Features */}
                    <section className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">How We Keep You Safe</h2>
                            <p className="text-subtle-light text-lg max-w-2xl mx-auto">
                                Multiple layers of protection to ensure a trustworthy experience.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {safetyFeatures.map((feature) => (
                                <div key={feature.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4 text-secondary">
                                        <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                    <p className="text-subtle-light text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Safety Guidelines */}
                    <section className="mb-20">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 md:p-12">
                                <h2 className="text-3xl font-bold mb-8 text-center">Safety Guidelines</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {guidelines.map((guideline, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-bold mb-1">{guideline.title}</h3>
                                                <p className="text-subtle-light text-sm">{guideline.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Report an Issue */}
                    <section className="bg-red-50 rounded-3xl p-12 border border-red-100">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 text-red-600">
                                <span className="material-symbols-outlined text-3xl">report</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-red-900">Need to Report Something?</h2>
                            <p className="text-red-700 mb-8">
                                If you've experienced or witnessed any unsafe behavior, harassment, or fraud, please report it immediately. All reports are taken seriously and handled confidentially.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Report an Issue
                                </Link>
                                <a
                                    href="tel:+15551234567"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-bold rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                                >
                                    Emergency: +1 (555) 123-4567
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
