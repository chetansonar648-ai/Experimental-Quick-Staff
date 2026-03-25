import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import defaultWorkerAvatar from "../../../assets/worker_default_avatar.png";

const BookStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get("workerId");

  // Get state passed from Step 1
  const { worker: workerFromState, service, date, time } = location.state || {};

  // Create a user-friendly date string for display
  const displayDate = date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Date";

  const [worker, setWorker] = useState(workerFromState || null);
  const [loading, setLoading] = useState(!workerFromState);

  const [formData, setFormData] = useState({
    location: "",
    duration: "4",
    instructions: ""
  });

  useEffect(() => {
    if (!worker && workerId) {
      fetch(`/api/workers/${workerId}`)
        .then(res => res.json())
        .then(data => setWorker(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [workerId, worker]);

  const handleNext = () => {
    // Pass data to Step 3
    navigate(`/client/book/step-3`, {
      state: {
        worker,
        service,
        date,
        time,
        ...formData
      }
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading details...</p>
      </div>
    </main>
  );

  if (!worker) return null;

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Worker Header */}
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-start sm:items-center gap-4 mb-8">
          <img
            alt={worker.name}
            className="size-16 rounded-full object-cover border-2 border-white dark:border-gray-800"
            src={worker.image_url || defaultWorkerAvatar}
            onError={(e) => { e.target.src = defaultWorkerAvatar; }}
          />
          <div className="flex-grow">
            <p className="text-sm text-gray-500 dark:text-gray-400">You are booking:</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{worker.name}</h2>
            <p className="text-primary font-medium">{worker.role}</p>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 text-right space-y-1 flex-shrink-0">
            <div className="flex items-center justify-end gap-2">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              <p>{displayDate}</p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="material-symbols-outlined text-base">schedule</span>
              <p>{time}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Steps Nav */}
          <div className="md:col-span-1">
            <nav>
              <ul className="space-y-4">
                <li>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 dark:bg-primary/30 text-primary font-bold">
                      <span className="material-symbols-outlined">check</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-600 dark:text-gray-300">Service & Time</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                    </div>
                  </div>
                </li>
                <li><div className="h-6 w-px bg-gray-200 dark:bg-gray-700 ml-4"></div></li>
                <li>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white font-bold">2</div>
                    <div>
                      <h3 className="font-bold text-primary">Details</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location and instructions</p>
                    </div>
                  </div>
                </li>
                <li><div className="h-6 w-px bg-gray-200 dark:bg-gray-700 ml-4"></div></li>
                <li>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-600 dark:text-gray-300">Confirm & Pay</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Review and finalize</p>
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Service Location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="address-search">Search for Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                      <input
                        className="w-full pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                        id="address-search"
                        placeholder="E.g., 123 Main St, Anytown, USA"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="saved-address">Or Use a Saved Address</label>
                    <select className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary" id="saved-address">
                      <option>No saved addresses</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Service Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="instructions">Instructions for Worker</label>
                    <textarea
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                      id="instructions"
                      placeholder="E.g., Please use the back entrance for deliveries. Report to the event manager, Susan, upon arrival."
                      rows="4"
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="duration">Estimated Duration (hours)</label>
                    <select
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                    >
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                      <option value="5">5 hours</option>
                      <option value="6">6 hours</option>
                      <option value="7">7 hours</option>
                      <option value="8">8 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <span>Next</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookStep2;

