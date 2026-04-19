import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const faqs = {
    workers: [
        { q: 'How do I create a worker profile?', a: 'Click "Sign Up" and select "I want to WORK". Fill in your skills, experience, and availability. Once verified, you can start browsing job opportunities.' },
        { q: 'How do I get paid for completed jobs?', a: 'Payment is processed after the client confirms job completion. Funds are transferred directly to your linked bank account within 2-3 business days.' },
        { q: 'Can I choose my own working hours?', a: 'Absolutely! You have full control over your availability. Simply update your profile to reflect when you\'re available to work.' },
        { q: 'What if a client cancels a job?', a: 'If a client cancels within 24 hours of the scheduled start time, you may be eligible for a cancellation fee. Check our policies for details.' },
    ],
    clients: [
        { q: 'How do I post a job?', a: 'After registering as a client, go to your dashboard and click "Post a Job". Fill in the details including job type, location, date, and required skills.' },
        { q: 'How are workers verified?', a: 'All workers undergo identity verification and background checks. We also track performance ratings and reviews from previous clients.' },
        { q: 'What if I\'m not satisfied with a worker?', a: 'Contact our support team immediately. We have a satisfaction guarantee and will work to resolve any issues or provide a replacement.' },
        { q: 'How does billing work?', a: 'You\'re only charged after a job is completed and you confirm satisfaction. Payments are processed securely through our platform.' },
    ],
    general: [
        { q: 'Is Quick Staff Hiring Portal free to use?', a: 'Creating an account is free. Workers keep most of their earnings, and clients pay a small service fee on completed jobs.' },
        { q: 'What areas do you serve?', a: 'We currently operate in major metropolitan areas across the United States. Check our coverage map for specific locations.' },
        { q: 'How do I contact support?', a: 'You can reach our support team via email at support@quickstaff.com or through the Help Center in your dashboard.' },
        { q: 'Is my personal information secure?', a: 'Yes, we use industry-standard encryption and security measures to protect all user data. See our Privacy Policy for details.' },
    ],
};

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left hover:text-primary transition-colors"
            >
                <span className="font-semibold text-lg pr-4">{question}</span>
                <span className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>
            {isOpen && (
                <div className="pb-5 text-subtle-light leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    const [activeTab, setActiveTab] = useState('general');

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
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            Find answers to common questions about using Quick Staff Hiring Portal.
                        </p>
                    </div>
                </section>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">

                    {/* Tab Navigation */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {[
                            { id: 'general', label: 'General' },
                            { id: 'workers', label: 'For Workers' },
                            { id: 'clients', label: 'For Clients' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === tab.id
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-text-light border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        {faqs[activeTab].map((faq, index) => (
                            <FAQItem key={index} question={faq.q} answer={faq.a} />
                        ))}
                    </div>

                    {/* Still Need Help */}
                    <div className="mt-12 text-center">
                        <p className="text-subtle-light text-lg mb-4">Still have questions?</p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
