import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ClientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchClientDetails();
    }, [id]);

    const fetchClientDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token') || localStorage.getItem('qs_token');

            console.log('Fetching client details for ID:', id);
            console.log('Token:', token ? 'Present' : 'Missing');

            // Fetch client basic info from users table
            const response = await fetch(`/api/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to fetch client details: ${response.status}`);
            }

            const data = await response.json();
            console.log('Client data received:', data);
            setClient(data);

            // Fetch bookings with this client
            try {
                console.log('Fetching bookings for client:', id);
                const bookingsResponse = await fetch(`/api/bookings/client/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Bookings response status:', bookingsResponse.status);

                if (bookingsResponse.ok) {
                    const bookingsData = await bookingsResponse.json();
                    console.log('Bookings data received:', bookingsData);
                    setBookings(bookingsData);
                } else {
                    console.warn('Could not fetch bookings:', bookingsResponse.status);
                }
            } catch (err) {
                console.log('Could not fetch bookings:', err);
            }

        } catch (err) {
            console.error('Error fetching client details:', err);
            setError(err.message || 'Failed to load client profile');
        } finally {
            setLoading(false);
        }
    };

    const SidebarLink = ({ to, label, icon, active }) => (
        <Link to={to} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${active ? 'bg-primary/20 text-primary font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <span className={`material-symbols-outlined ${active ? 'text-primary' : ''}`} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
            <p className="text-sm leading-normal">{label}</p>
        </Link>
    );

    if (loading) {
        return (
            <div className="flex h-screen bg-background-light dark:bg-background-dark font-display items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading client profile...</p>
                </div>
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="flex h-screen bg-background-light dark:bg-background-dark font-display items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Profile</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'Client not found'}</p>
                    <button
                        onClick={() => navigate('/worker/saved-clients')}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Back to Saved Clients
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark font-display">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="bg-primary p-2 rounded-lg"><span className="material-symbols-outlined text-white">work</span></div>
                    <h2 className="text-lg font-bold">QuickStaff</h2>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <SidebarLink to="/worker/dashboard" label="Dashboard" icon="dashboard" />
                    <SidebarLink to="/worker/jobs?status=pending" label="Job Requests" icon="notifications" />
                    <SidebarLink to="/worker/jobs?status=accepted" label="Accepted Jobs" icon="task_alt" />
                    <SidebarLink to="/worker/jobs?status=in_progress" label="Active Job" icon="work" />
                    <SidebarLink to="/worker/jobs?status=completed" label="Past Jobs" icon="history" />
                    <SidebarLink to="/worker/jobs?status=rejected" label="Rejected Jobs" icon="thumb_down" />
                    <SidebarLink to="/worker/jobs?status=cancelled" label="Cancelled Jobs" icon="cancel" />
                    <SidebarLink to="/worker/saved-clients" label="Saved Clients" icon="bookmark" />
                    <SidebarLink to="/worker/profile" label="Profile" icon="person" />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-6"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span>Back</span>
                    </button>

                    {/* Client Profile Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <img
                                    src={client.profile_image || 'https://via.placeholder.com/150'}
                                    alt={client.name}
                                    className="w-24 h-24 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                    }}
                                />
                                <div className="flex-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{client.name}</h1>
                                    <div className="flex flex-col gap-2 text-gray-600 dark:text-gray-400">
                                        {client.email && (
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-base">email</span>
                                                <span>{client.email}</span>
                                            </div>
                                        )}
                                        {client.phone && (
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-base">phone</span>
                                                <span>{client.phone}</span>
                                            </div>
                                        )}
                                        {client.address && (
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-base">location_on</span>
                                                <span>{client.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking History */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Booking History</h2>
                        </div>
                        <div className="p-6">
                            {bookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">history</span>
                                    <p className="text-gray-500 dark:text-gray-400">No booking history with this client</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{booking.service_name}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(booking.booking_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            {booking.special_instructions && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                                                    "{booking.special_instructions}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientProfile;
