import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchWorkerJobs, updateWorkerJobStatus, undoWorkerJobStatus, saveClientFromJob } from '../../api/client';
import { useToast } from '../../context/ToastContext';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const WorkerJobs = () => {
  const query = useQuery();
  const statusFilter = query.get('status') || 'pending'; // Default to requests
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Map filters to UI titles and empty states
  const titles = {
    'pending': 'Job Requests',
    'accepted': 'Accepted Jobs',
    'in_progress': 'Active Job',
    'completed': 'Past Jobs',
    'rejected': 'Rejected Jobs',
    'cancelled': 'Cancelled Jobs'
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchWorkerJobs(statusFilter);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [statusFilter]);

  // Action labels for notifications
  const actionLabels = {
    'accepted': 'Job accepted',
    'rejected': 'Job rejected',
    'cancelled': 'Job cancelled',
    'in_progress': 'Job started',
    'completed': 'Job completed'
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const result = await updateWorkerJobStatus(id, newStatus);

      // Show notification with undo option for accept/reject/cancel
      const canUndo = ['accepted', 'rejected', 'cancelled'].includes(newStatus);

      showToast(
        actionLabels[newStatus] || `Status updated to ${newStatus}`,
        'success',
        canUndo ? {
          undoAction: async () => {
            try {
              await undoWorkerJobStatus(id);
              showToast('Action undone successfully', 'info');
              loadJobs();
            } catch (err) {
              showToast(err.message || 'Failed to undo', 'error');
            }
          },
          undoDuration: 60
        } : {}
      );

      loadJobs(); // Refresh list
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Save client from a completed job
  const handleSaveClient = async (jobId) => {
    try {
      const result = await saveClientFromJob(jobId);
      if (result.alreadySaved) {
        showToast('Client already saved', 'info');
      } else {
        showToast('Client saved successfully', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to save client', 'error');
    }
  };

  const SidebarLink = ({ to, label, icon, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${active ? 'bg-primary/20 text-primary font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
      <span className={`material-symbols-outlined ${active ? 'text-primary' : ''}`} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
      <p className="text-sm leading-normal">{label}</p>
    </Link>
  );

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Sidebar - Copied from Dashboard/HTML for consistency */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-primary p-2 rounded-lg"><span className="material-symbols-outlined text-white">work</span></div>
          <h2 className="text-lg font-bold">QuickStaff</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink to="/worker/dashboard" label="Dashboard" icon="dashboard" />
          <SidebarLink to="/worker/jobs?status=pending" label="Job Requests" icon="notifications" active={statusFilter === 'pending'} />
          <SidebarLink to="/worker/jobs?status=accepted" label="Accepted Jobs" icon="task_alt" active={statusFilter === 'accepted'} />
          <SidebarLink to="/worker/jobs?status=in_progress" label="Active Job" icon="work" active={statusFilter === 'in_progress'} />
          <SidebarLink to="/worker/jobs?status=completed" label="Past Jobs" icon="history" active={statusFilter === 'completed'} />
          <SidebarLink to="/worker/jobs?status=rejected" label="Rejected Jobs" icon="thumb_down" active={statusFilter === 'rejected'} />
          <SidebarLink to="/worker/jobs?status=cancelled" label="Cancelled Jobs" icon="cancel" active={statusFilter === 'cancelled'} />
          <SidebarLink to="/worker/saved-clients" label="Saved Clients" icon="bookmark" />
          <SidebarLink to="/worker/profile" label="Profile" icon="person" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col items-start w-full overflow-hidden">
        <header className="flex w-full items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">{titles[statusFilter]}</h2>
        </header>

        <div className="flex-1 w-full overflow-y-auto p-6 md:p-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {loading ? (
              <div>Loading...</div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 mt-8">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                  <span className="material-symbols-outlined text-4xl">work_history</span>
                </div>
                <h3 className="text-lg font-bold">No {titles[statusFilter].toLowerCase()} found.</h3>
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Customer: {job.client_name}</h3>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <span className="material-symbols-outlined text-base">location_on</span>
                          <span>{job.address || 'No address provided'}</span>
                        </div>
                      </div>
                      {/* Timer or Status Pill */}
                      <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                        {job.status.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                      <h4 className="font-semibold mb-2 text-sm">Job Description</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-2">
                        {/* Assuming description comes from Service or Booking notes. Booking has special_instructions. Service has description. */}
                        {job.special_instructions || "No special instructions."}
                        <br />
                        <span className="italic text-gray-400">Service: {job.service_name}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-3 flex justify-end items-center">
                    <div className="flex gap-2">
                      {statusFilter === 'pending' && (
                        <>
                          <button onClick={() => handleStatusUpdate(job.id, 'rejected')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-300">Decline</button>
                          <button onClick={() => handleStatusUpdate(job.id, 'accepted')} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700">Accept</button>
                        </>
                      )}
                      {statusFilter === 'accepted' && (
                        <>
                          <button onClick={() => handleStatusUpdate(job.id, 'cancelled')} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-sm hover:bg-red-200">Cancel Job</button>
                          <button onClick={() => handleStatusUpdate(job.id, 'in_progress')} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700">Start Job</button>
                        </>
                      )}
                      {statusFilter === 'in_progress' && (
                        <button onClick={() => handleStatusUpdate(job.id, 'completed')} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700">Complete</button>
                      )}
                      {statusFilter === 'completed' && (
                        <button onClick={() => handleSaveClient(job.id)} className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">bookmark_add</span>
                          Save Client
                        </button>
                      )}
                      {statusFilter === 'rejected' && (
                        <span className="text-sm text-gray-500 font-medium">Archived</span>
                      )}
                      {statusFilter === 'cancelled' && (
                        <span className="text-sm text-gray-500 font-medium">Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerJobs;
