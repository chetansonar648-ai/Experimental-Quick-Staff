import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';

/**
 * Read-only Client Profile View for Workers
 * Shows basic client details from saved_clients data
 */
const ClientProfileView = () => {
    const { clientId } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                // Fetch saved clients and find the one we need
                const response = await api.get('/workers/saved-clients');
                const found = response.data.find(c => c.client_id === parseInt(clientId));
                if (found) {
                    setClient(found);
                } else {
                    setError('Client not found in your saved clients');
                }
            } catch (err) {
                setError(err.message || 'Failed to load client details');
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [clientId]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Link to="/worker/saved-clients" className="text-primary hover:underline">
                        ← Back to Saved Clients
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
            <div className="max-w-2xl mx-auto">
                {/* Back Link */}
                <Link
                    to="/worker/saved-clients"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-6"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Saved Clients
                </Link>

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    <div className="flex items-center gap-6 mb-8">
                        <img
                            src={client.profile_image || 'https://via.placeholder.com/100'}
                            alt={client.name}
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
                            <p className="text-gray-500 dark:text-gray-400">Client</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h3>
                            <p className="text-gray-900 dark:text-white">
                                {client.email || <span className="text-gray-400 italic">Not provided</span>}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</h3>
                            <p className="text-gray-900 dark:text-white">
                                {client.phone || <span className="text-gray-400 italic">Not provided</span>}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</h3>
                            <p className="text-gray-900 dark:text-white">
                                {client.address || <span className="text-gray-400 italic">Not provided</span>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfileView;
