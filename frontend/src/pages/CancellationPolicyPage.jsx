import React from "react";
import { Link } from "react-router-dom";

const CancellationPolicyPage = () => {
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
                <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Cancellation Policy</h1>
                <p className="text-gray-500 mb-8">Last updated: December 16, 2025</p>

                <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">1. Client Cancellation</h2>
                        <p>
                            Clients may cancel a booking up to 24 hours before the scheduled service time for a full refund. Cancellations made within 24 hours may be subject to a cancellation fee of up to 50% of the service cost.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">2. Worker Cancellation</h2>
                        <p>
                            If a worker cancels, the client will receive a full refund immediately. Workers who frequently cancel accepted jobs may face penalties or account suspension.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">3. No-Shows</h2>
                        <p>
                            If a client is not present at the location and time of service, the worker will wait for 15 minutes. After this, it is considered a no-show, and no refund will be issued.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">4. Weather & Emergencies</h2>
                        <p>
                            In cases of severe weather or emergencies, cancellations may be made without penalty, subject to verification.
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

export default CancellationPolicyPage;
