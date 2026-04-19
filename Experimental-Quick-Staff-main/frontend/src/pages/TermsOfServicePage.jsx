import React from "react";
import { Link } from "react-router-dom";

const TermsOfServicePage = () => {
    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen text-text-light dark:text-text-dark">
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 px-6 md:px-12 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg">
                            <span className="material-symbols-outlined text-white">work</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                            QuickStaff
                        </span>
                    </Link>
                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300">
                        Back to Login
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Terms of Service</h1>
                <p className="text-gray-500 mb-8">Last updated: December 16, 2025</p>

                <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using QuickStaff ("Service"), you agree to abide by these Terms of Service. If you do not agree, you must not use our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">2. User Responsibilities</h2>
                        <p>
                            Users are responsible for maintaining the confidentiality of their account credentials and are fully responsible for all activities that occur under their account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">3. Booking & Payments</h2>
                        <p>
                            All bookings made through QuickStaff are binding. We act as a facilitator; the actual contract is between the Client and the Worker.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">4. Prohibited Conduct</h2>
                        <p>
                            Users must not harass, abuse, or harm another person or group, or use the Service for any illegal activities.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">5. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your account at our discretion if you violate these Terms.
                        </p>
                    </section>
                </div>
            </main>

            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 mt-12">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} QuickStaff. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default TermsOfServicePage;
