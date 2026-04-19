import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const sections = [
    {
        title: 'Information We Collect',
        content: `We collect information you provide directly, such as when you create an account, complete your profile, or contact us. This includes:
    • Personal identification information (name, email, phone number)
    • Profile information (skills, experience, availability)
    • Payment and billing information
    • Communications with us and other users
    • Job history and ratings`
    },
    {
        title: 'How We Use Your Information',
        content: `We use the information we collect to:
    • Provide, maintain, and improve our services
    • Process transactions and send related information
    • Connect workers with clients based on job requirements
    • Send you technical notices, updates, and support messages
    • Respond to your comments, questions, and customer service requests
    • Monitor and analyze trends, usage, and activities`
    },
    {
        title: 'Information Sharing',
        content: `We may share your information in the following circumstances:
    • With other users as part of the platform's functionality (e.g., sharing worker profiles with clients)
    • With vendors, consultants, and service providers who need access to perform services for us
    • In response to legal process or government requests
    • To protect the rights, property, and safety of Quick Staff, our users, or the public
    • In connection with a merger, acquisition, or sale of assets`
    },
    {
        title: 'Data Security',
        content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
    • Encryption of data in transit and at rest
    • Regular security assessments and audits
    • Access controls and authentication measures
    • Employee training on data protection practices`
    },
    {
        title: 'Your Rights and Choices',
        content: `You have certain rights regarding your personal information:
    • Access and update your account information at any time
    • Request deletion of your personal data
    • Opt out of marketing communications
    • Request a copy of your data in a portable format
    • Object to certain processing of your information`
    },
    {
        title: 'Cookies and Tracking',
        content: `We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings, though disabling them may affect your experience on our platform.`
    },
    {
        title: 'Children\'s Privacy',
        content: `Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will take steps to delete it.`
    },
    {
        title: 'Changes to This Policy',
        content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of the platform after changes constitutes acceptance of the updated policy.`
    },
];

export default function PrivacyPolicyPage() {
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
                            Privacy Policy
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            Your privacy matters to us. Learn how we collect, use, and protect your information.
                        </p>
                        <p className="text-blue-200 text-sm mt-6">Last Updated: December 10, 2024</p>
                    </div>
                </section>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">

                    {/* Introduction */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
                        <p className="text-subtle-light leading-relaxed">
                            Quick Staff Hiring Portal ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully to understand our practices regarding your personal data.
                        </p>
                    </div>

                    {/* Policy Sections */}
                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                <h2 className="text-xl font-bold mb-4 text-primary">{section.title}</h2>
                                <div className="text-subtle-light leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="mt-12 bg-primary/5 rounded-2xl p-8 border border-primary/10">
                        <h2 className="text-xl font-bold mb-4">Contact Us</h2>
                        <p className="text-subtle-light mb-4">
                            If you have questions about this Privacy Policy or our data practices, please contact us:
                        </p>
                        <ul className="text-subtle-light space-y-2">
                            <li>Email: privacy@quickstaff.com</li>
                            <li>Address: 123 Business Avenue, New York, NY 10001</li>
                        </ul>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-6 py-3 mt-6 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Contact Privacy Team
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
