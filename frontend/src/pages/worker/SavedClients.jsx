import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchSavedClients } from '../../api/client';
import { useToast } from '../../context/ToastContext';

const SavedClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchSavedClients()
      .then(setClients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const SidebarLink = ({ to, label, icon, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${active ? 'bg-primary/20 text-primary font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
      <span className={`material-symbols-outlined ${active ? 'text-primary' : ''}`} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
      <p className="text-sm leading-normal">{label}</p>
    </Link>
  );

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display">
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
          <SidebarLink to="/worker/saved-clients" label="Saved Clients" icon="bookmark" active={true} />
          <SidebarLink to="/worker/profile" label="Profile" icon="person" />
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Clients</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage clients you've marked as favorites.</p>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-400" placeholder="Search clients..." type="text" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary">
              <option>Most Recent</option>
              <option>Name (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No saved clients.</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {clients.map(client => (
                <li key={client.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img alt={client.name} className="w-12 h-12 rounded-full object-cover" src={client.profile_image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDK31GFbTbEj4Pi6pvx_71PYSup1WxJDqprGR9OKW8z0AhsjbosG8TOvc4KlwDZErGgEOwGB3mVXjQT1QtV20RguvGceGoxcWq3sBgT_XQnlb3lkfvvir1vP9dBIh3hPOytRat75qwMnmeo_poso7MfJ609m1lzNMUUdywHDPwl6JO3wwW9uOiNaqDIaKR-9RN5y3rOXFJqsT5_iES3zWjbF79dTUh2-dBswk8XLlBlznGeoS_5UcCohgKN4Z-M-5b0Md1fnLs_vA"} />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{client.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => navigate(`/worker/client/${client.client_id}`)}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                    >
                      Contact
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Contact Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedClient(null)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contact Details</h3>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedClient.profile_image || 'https://via.placeholder.com/60'}
                alt={selectedClient.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{selectedClient.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="material-symbols-outlined text-gray-500">mail</span>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white">{selectedClient.email || 'Not available'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="material-symbols-outlined text-gray-500">phone</span>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white">{selectedClient.phone || 'Not available'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="material-symbols-outlined text-gray-500">location_on</span>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-gray-900 dark:text-white">{selectedClient.address || 'Not available'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedClient(null)}
              className="w-full mt-6 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedClients;
