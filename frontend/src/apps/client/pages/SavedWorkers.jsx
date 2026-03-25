import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultWorkerAvatar from "../../../assets/worker_default_avatar.png";

const SavedWorkers = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSavedWorkers();
  }, [searchQuery]);

  const fetchSavedWorkers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
      const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
      const response = await fetch(`/api/saved-workers${params}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWorkers(data);
      }
    } catch (error) {
      console.error("Error fetching saved workers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (workerId) => {
    if (confirm("Remove this worker from your saved list?")) {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
        const response = await fetch(`/api/saved-workers/${workerId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        });
        if (response.ok) {
          setWorkers(prev => prev.filter(w => w.worker_id !== workerId));
        }
      } catch (error) {
        console.error("Error removing saved worker:", error);
      }
    }
  };

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (worker.description && worker.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Saved Workers</h2>
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
              placeholder="Search saved workers..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading saved workers...</p>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? "No workers found matching your search." : "No saved workers yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredWorkers.map((w) => (
              <article
                key={w.id}
                className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="relative">
                  <img
                    alt={w.name}
                    className="w-full h-40 sm:h-48 object-cover"
                    src={w.image_url || defaultWorkerAvatar}
                    onError={(e) => {
                      e.target.src = defaultWorkerAvatar;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(w.worker_id)}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base sm:text-lg">
                      bookmark_remove
                    </span>
                  </button>
                </div>
                <div className="p-3 sm:p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-1">
                    {w.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-primary font-medium mb-2">{w.role}</p>
                  <div className="flex items-center gap-1 text-yellow-500 mb-2">
                    <span
                      className="material-symbols-outlined !text-sm sm:!text-base !leading-none"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {parseFloat(w.rating || 0).toFixed(1)}{" "}
                      <span className="text-gray-400 font-normal">
                        ({w.rating_count || 0} reviews)
                      </span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 flex-grow line-clamp-2">
                    {w.description || "No description available."}
                  </p>
                  <div className="mt-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/client/book/step-1?workerId=${w.worker_id}`)}
                      className="flex-1 flex min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap"
                    >
                      Book Now
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/client/staff/${w.worker_id}`)}
                      className="flex-1 flex min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-gray-200/80 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-bold hover:bg-gray-300/80 dark:hover:bg-gray-700/80 transition-colors whitespace-nowrap"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default SavedWorkers;
