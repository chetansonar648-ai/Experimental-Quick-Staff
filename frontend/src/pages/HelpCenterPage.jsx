import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const categories = [
    { icon: 'person', title: 'Account & Profile', description: 'Manage your account settings, update profile information, and handle login issues.', link: '/faq' },
    { icon: 'work', title: 'Jobs & Hiring', description: 'Learn how to post jobs, apply for work, and manage your job listings.', link: '/faq' },
    { icon: 'payments', title: 'Payments & Billing', description: 'Understand payment processing, invoicing, and resolve billing questions.', link: '/faq' },
    { icon: 'security', title: 'Safety & Trust', description: 'Our verification process, safety guidelines, and reporting issues.', link: '/trust-safety' },
    { icon: 'devices', title: 'Technical Support', description: 'Troubleshoot app issues, browser compatibility, and technical problems.', link: '/contact' },
    { icon: 'policy', title: 'Policies & Guidelines', description: 'Review our terms, privacy policy, and community guidelines.', link: '/terms-of-service' },
];

const popularArticles = [
    'How to create a worker profile',
    'Posting your first job as a client',
    'Understanding payment processing',
    'How verification works',
    'Updating your availability',
    'Resolving disputes between parties',
];

export default function HelpCenterPage() {
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
                            Help Center
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-8">
                            How can we help you today? Browse our resources or search for answers.
                        </p>
                        <div className="max-w-xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for help..."
                                    className="w-full px-6 py-4 rounded-xl text-text-light focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined">search</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">

                    {/* Help Categories */}
                    <section className="mb-20">
                        <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.title}
                                    to={cat.link}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{cat.title}</h3>
                                    <p className="text-subtle-light text-sm">{cat.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Popular Articles */}
                    <section className="mb-20">
                        <h2 className="text-2xl font-bold mb-8 text-center">Popular Articles</h2>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {popularArticles.map((article, index) => (
                                    <Link
                                        key={index}
                                        to="/faq"
                                        className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                                    >
                                        <span className="material-symbols-outlined text-primary">article</span>
                                        <span className="group-hover:text-primary transition-colors">{article}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Contact Support */}
                    <section className="bg-primary rounded-3xl p-12 text-center text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Can't Find What You're Looking For?</h2>
                            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                                Our support team is available to help you with any questions or issues.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
