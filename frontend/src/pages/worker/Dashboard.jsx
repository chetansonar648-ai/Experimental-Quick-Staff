import React, { useEffect, useState } from 'react';
import { fetchWorkerStats, fetchWorkerMe, fetchWorkerJobs } from '../../api/client';
import { Link, useLocation } from 'react-router-dom';

const WorkerDashboard = () => {
  const [stats, setStats] = useState({ total_earnings: 0, completed_jobs: 0, rating: 0 });
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loadData = async () => {
      try {

        const token = localStorage.getItem('token');
        if (!token) {
          setError("No authentication token found. Please log in first.");
          return;
        }



        const [statsData, userData] = await Promise.all([
          fetchWorkerStats(),
          fetchWorkerMe(),
        ]);



        const activeJobs = await fetchWorkerJobs('active');
        const historyJobs = await fetchWorkerJobs('history');

        setStats(statsData);
        setUser(userData);
        setSchedule(activeJobs);
        setHistory(historyJobs);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError(`Failed to load dashboard data: ${err.message || 'Unknown error'}. Please make sure you are logged in and the server is running.`);
      }
    };
    loadData();
  }, []);

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!user) return <div className="p-8">Loading...</div>;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative flex h-auto min-h-screen w-full group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark text-[#111618] dark:text-gray-200">
      <div className="flex min-h-screen w-full">
        <aside className="w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 hidden md:flex">
          <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-[#111618] dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] whitespace-nowrap">Quick Staff</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${isActive('/worker/dashboard') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              to="/worker/dashboard"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-semibold">Dashboard</span>
            </Link>
            <Link
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${isActive('/worker/jobs') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              to="/worker/jobs"
            >
              <span className="material-symbols-outlined">work</span>
              <span className="text-sm font-medium">My Jobs</span>
            </Link>

            <Link
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${isActive('/worker/saved-clients') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              to="/worker/saved-clients"
            >
              <span className="material-symbols-outlined">bookmark</span>
              <span className="text-sm font-medium">Saved Clients</span>
            </Link>
            <Link
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${isActive('/worker/profile') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              to="/worker/profile"
            >
              <span className="material-symbols-outlined">person</span>
              <span className="text-sm font-medium">Profile</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Link className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" to="/worker/profile">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{ backgroundImage: `url("${user.profile_image || 'https://via.placeholder.com/150'}")` }}
              ></div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-[#111618] dark:text-gray-100">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">View Profile</p>
              </div>
            </Link>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="md:hidden flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 bg-white dark:bg-background-dark sticky top-0 z-10">
            <div className="flex items-center gap-4 text-[#111618] dark:text-gray-100">
              <div className="size-6 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-[#111618] dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em]">Quick Staff</h2>
            </div>
            <button className="p-2">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </header>

          <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 bg-background-light dark:bg-background-dark">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <p className="text-[#111618] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                  Welcome back, {user.name.split(' ')[0]}!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <p className="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal">Total Reviews</p>
                  <p className="text-[#111618] dark:text-white tracking-light text-3xl font-bold leading-tight">
                    {stats.total_reviews || 0}
                  </p>
                  <p className="text-positive text-sm font-medium leading-normal flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">thumb_up</span>
                    <span>Positive feedback</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <p className="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal">Jobs Completed</p>
                  <p className="text-[#111618] dark:text-white tracking-light text-3xl font-bold leading-tight">{stats.completed_jobs}</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <p className="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal">Average Rating</p>
                  <p className="text-[#111618] dark:text-white tracking-light text-3xl font-bold leading-tight flex items-center gap-1.5">
                    {Number(stats.rating || 0).toFixed(1)} <span className="material-symbols-outlined !text-3xl text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="pb-3">
                    <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 gap-8">
                      <button
                        onClick={() => setActiveTab('scheduled')}
                        className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${activeTab === 'scheduled' ? 'border-b-primary text-primary' : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'}`}
                      >
                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">Scheduled Jobs</p>
                      </button>
                      <button
                        onClick={() => setActiveTab('history')}
                        className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${activeTab === 'history' ? 'border-b-primary text-primary' : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'}`}
                      >
                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">Job History</p>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
                    {(activeTab === 'scheduled' ? schedule : history).map((job) => (
                      <div key={job.id} className="flex items-center gap-4 bg-transparent px-6 min-h-[72px] py-4 justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                        <div className="flex items-center gap-4">
                          <div className="text-[#111618] dark:text-gray-300 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0 size-12">
                            <span className="material-symbols-outlined">
                              {job.service_name?.toLowerCase().includes('clean') ? 'cleaning_services' :
                                job.service_name?.toLowerCase().includes('driver') ? 'local_shipping' :
                                  job.service_name?.toLowerCase().includes('cook') ? 'restaurant' : 'calendar_month'}
                            </span>
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="text-[#111618] dark:text-white text-base font-medium leading-normal line-clamp-1">
                              {job.service_name} for {job.client_name}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">
                              {new Date(job.booking_date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <Link
                            to={`/worker/jobs?status=${job.status}`}
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-gray-100 dark:bg-gray-700 text-[#111618] dark:text-gray-200 text-sm font-medium leading-normal w-fit hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                          >
                            <span className="truncate">View Details</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                    {(activeTab === 'scheduled' ? schedule : history).length === 0 && (
                      <div className="p-8 text-center text-gray-500">No jobs found.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
