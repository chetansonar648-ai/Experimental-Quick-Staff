import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import defaultWorkerAvatar from "../../../assets/worker_default_avatar.png";

const BrowseStaff = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: "",
    category: searchParams.get("category") || "",
    min_price: "",
    max_price: "",
    min_rating: ""
  });
  const [showFilters, setShowFilters] = useState(searchParams.get("showFilters") === "true");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchStaff();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/workers/categories/list");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.location) params.append("location", filters.location);
      if (filters.category) params.append("category", filters.category);
      if (filters.min_price) params.append("min_price", filters.min_price);
      if (filters.max_price) params.append("max_price", filters.max_price);
      if (filters.min_rating) params.append("min_rating", filters.min_rating);

      const response = await fetch(`/api/workers?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch staff");
      }
      const data = await response.json();
      setStaff(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
      // Fallback to mock data - REMOVED per user request
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleViewProfile = (workerId) => {
    navigate(`/client/staff/${workerId}`);
  };

  const handleSaveWorker = async (workerId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
      if (!token) {
        alert("Please login to save workers.");
        return;
      }

      const response = await fetch(`/api/saved-workers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ worker_id: workerId })
      });
      if (response.ok) {
        alert("Worker saved successfully!");
      }
    } catch (err) {
      console.error("Error saving worker:", err);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
      <section className="space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
              search
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search for services (e.g., event server, plumber)"
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex-1 lg:flex-auto lg:w-48">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
                location_on
              </span>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                placeholder="Location"
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined !text-lg sm:!text-xl">tune</span>
              <span className="hidden sm:inline">All Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">Advanced Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Min Price ($/hr)</label>
                <input
                  type="number"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange("min_price", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Max Price ($/hr)</label>
                <input
                  type="number"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange("max_price", e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Min Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={filters.min_rating}
                  onChange={(e) => handleFilterChange("min_rating", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFilters({ search: "", location: "", category: "", min_price: "", max_price: "", min_rating: "" })}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <CategoryCard
                key={cat.category}
                icon={getCategoryIcon(cat.category)}
                title={cat.category}
                count={cat.count}
                onClick={() => handleFilterChange("category", cat.category)}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-sm">No categories available</div>
          )}
        </div>
      </section>

      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
            Available Workers ({staff.length || 0} found)
          </h2>
          <button
            type="button"
            onClick={() => navigate("/client/browse-staff")}
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading staff...</p>
          </div>
        )}
        {error && !loading && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 hidden">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              {error} (showing design layout only)
            </p>
          </div>
        )}

        {!loading && staff.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">No workers found. Try adjusting your filters.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {staff.map((member) => (
            <StaffCard key={member.id} member={member} onViewProfile={handleViewProfile} onBookNow={() => navigate(`/client/book/step-1?workerId=${member.id}`)} />
          ))}
        </div>
      </section>

      {showProfileModal && selectedWorker && (
        <WorkerProfileModal
          worker={selectedWorker}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedWorker(null);
          }}
          onBookNow={() => {
            navigate(`/client/book/step-1?workerId=${selectedWorker.id}`);
            setShowProfileModal(false);
          }}

          onSave={() => handleSaveWorker(selectedWorker.id)}
        />
      )}
    </main>
  );
};

const getCategoryIcon = (category) => {
  const map = {
    "Cleaning": "cleaning_services",
    "Plumbing": "plumbing",
    "Electrical": "electrical_services",
    "Construction": "construction",
    "Marketing": "campaign",
    "Event Staff": "celebration",
    "Hospitality": "restaurant",
    "Administrative": "edit_note",
    "Warehouse": "local_shipping",
    "Retail": "store",
    "Delivery": "delivery_dining"
  };
  return map[category] || "category";
};

const CategoryCard = ({ icon, title, count, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center text-center p-4 sm:p-6 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-center justify-center size-12 sm:size-14 rounded-full bg-primary/10 text-primary mb-3 sm:mb-4">
        <span className="material-symbols-outlined text-3xl sm:text-4xl">{icon}</span>
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{count > 0 ? `${count} available` : 'Browse'}</p>
    </button>
  );
};

const StaffCard = ({ member, onViewProfile, onBookNow }) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
      <div className="relative">
        <img
          alt={`Staff member ${member.name}`}
          className="w-full h-40 sm:h-48 object-cover"
          src={member.image_url || defaultWorkerAvatar}
          onError={(e) => {
            e.target.src = defaultWorkerAvatar;
          }}
        />
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
          <span className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-200">
            ${member.hourly_rate || 0}/hr
          </span>
        </div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white truncate">
                {member.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                {member.role}
              </p>
            </div>
            <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
              <span
                className="material-symbols-outlined !text-sm sm:!text-base !leading-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                {parseFloat(member.rating || 0).toFixed(1)}{" "}
                <span className="text-gray-400 font-normal">
                  ({member.rating_count || 0})
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onViewProfile(member.id)}
            className="flex-1 flex min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 sm:h-10 px-3 sm:px-4 bg-primary/10 text-primary text-xs sm:text-sm font-bold hover:bg-primary/20 transition-colors whitespace-nowrap"
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={onBookNow}
            className="flex-1 flex min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 sm:h-10 px-3 sm:px-4 bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

const WorkerProfileModal = ({ worker, onClose, onBookNow, onSave }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [workerDetails, setWorkerDetails] = useState(worker);

  useEffect(() => {
    if (worker && worker.id) {
      fetch(`/api/workers/${worker.id}`)
        .then(res => res.json())
        .then(data => setWorkerDetails(data))
        .catch(err => console.error("Error fetching worker details:", err));
    }
  }, [worker]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {workerDetails.name || worker.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <img
              src={workerDetails.image_url || worker.image_url}
              alt={workerDetails.name || worker.name}
              className="w-full sm:w-48 h-48 sm:h-64 object-cover rounded-xl"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {workerDetails.name || worker.name}
              </h3>
              <p className="text-primary font-semibold text-lg mb-4">
                {workerDetails.role || worker.role}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-lg font-bold">{parseFloat(workerDetails.rating || worker.rating || 0).toFixed(1)}</span>
                <span className="text-gray-500">({workerDetails.rating_count || worker.rating_count || 0} reviews)</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {workerDetails.description || worker.description || "No description available."}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onBookNow}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined">calendar_add_on</span>
                  <span>Book Now</span>
                </button>

                <button
                  type="button"
                  onClick={onSave}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined">bookmark_add</span>
                  <span>Add to Saved</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-800 mb-4">
            <div className="flex gap-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("skills")}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === "skills"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                Skills & Experience
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("portfolio")}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === "portfolio"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                Portfolio
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === "reviews"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                Reviews
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {activeTab === "overview" && (
              <div>
                <h4 className="font-semibold text-lg mb-2">About</h4>
                <p className="text-gray-600 dark:text-gray-300">{workerDetails.description || "No description available."}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hourly Rate</p>
                    <p className="text-lg font-bold">${workerDetails.hourly_rate || worker.hourly_rate || 0}/hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Jobs Completed</p>
                    <p className="text-lg font-bold">{workerDetails.total_jobs_completed || 0}</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "skills" && (
              <div>
                <h4 className="font-semibold text-lg mb-4">Skills & Experience</h4>
                {workerDetails.skills && workerDetails.skills.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {workerDetails.skills.map((skill, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="font-semibold">{skill.skill_name}</p>
                        {skill.years_experience && (
                          <p className="text-sm text-gray-500">{skill.years_experience} years experience</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills listed.</p>
                )}
              </div>
            )}
            {activeTab === "portfolio" && (
              <div>
                <h4 className="font-semibold text-lg mb-4">Portfolio</h4>
                {workerDetails.portfolio && workerDetails.portfolio.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {workerDetails.portfolio.map((item, idx) => (
                      <img key={idx} src={item.image_url} alt={item.description || "Portfolio"} className="w-full h-32 object-cover rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No portfolio images available.</p>
                )}
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <h4 className="font-semibold text-lg mb-4">Client Reviews</h4>
                {workerDetails.reviews && workerDetails.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {workerDetails.reviews.map((review, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                          <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        {review.comment && <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>}
                        {review.client_name && <p className="text-sm text-gray-500 mt-2">- {review.client_name}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseStaff;
