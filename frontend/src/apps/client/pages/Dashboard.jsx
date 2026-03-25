import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/client";
import defaultWorkerAvatar from "../../../assets/worker_default_avatar.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    pendingReviews: 0
  });

  const [recommendedStaff, setRecommendedStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch booking stats with proper token
      const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
      const statsRes = await fetch("/api/bookings/stats/summary", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          active: statsData.active || 0,
          completed: statsData.completed || 0,
          pendingReviews: 0
        });
      }

      // Fetch pending reviews count
      try {
        const reviewsRes = await fetch("/api/reviews/pending", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setStats(prev => ({ ...prev, pendingReviews: reviewsData?.length || 0 }));
        }
      } catch (err) {
        console.log("Reviews endpoint not available yet");
      }

      // Fetch recommended staff (top rated)
      const staffRes = await api.get("/workers");
      if (staffRes.data) {
        setRecommendedStaff(staffRes.data.slice(0, 4)); // Show first 4 workers
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/client/browse-staff?category=${encodeURIComponent(category)}`);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append("search", searchQuery);
    }
    navigate(`/client/browse-staff?${params.toString()}`);
  };

  const handleFiltersClick = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append("search", searchQuery);
    }
    params.append("showFilters", "true");
    navigate(`/client/browse-staff?${params.toString()}`);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
      <section>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Quick Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => navigate("/client/bookings?tab=active")}
            className="text-left bg-white dark:bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 flex items-start gap-3 sm:gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-lg sm:text-xl">work</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Active Bookings
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? "..." : stats.active}
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigate("/client/bookings?tab=completed")}
            className="text-left bg-white dark:bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 flex items-start gap-3 sm:gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="p-2 sm:p-3 rounded-full bg-green-500/10 text-green-500 flex-shrink-0">
              <span className="material-symbols-outlined text-lg sm:text-xl">task_alt</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Completed Jobs
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? "..." : stats.completed}
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigate("/client/bookings?tab=pendingReviews")}
            className="text-left bg-white dark:bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 flex items-start gap-3 sm:gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="p-2 sm:p-3 rounded-full bg-yellow-500/10 text-yellow-500 flex-shrink-0">
              <span className="material-symbols-outlined text-lg sm:text-xl">pending_actions</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Pending Reviews
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? "..." : stats.pendingReviews}
              </p>
            </div>
          </button>

        </div>
      </section>

      <section>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Recommended Staff
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="col-span-full text-center py-8 text-red-500 hidden">{error}</div>
          ) : recommendedStaff.length > 0 ? (
            recommendedStaff.map((member) => (
              <RecommendedCard key={member.id} member={member} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">No staff available</div>
          )}
        </div>
      </section>

      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
            Browse Staff Categories
          </h2>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={handleFiltersClick}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined !text-xl">filter_list</span>
              <span>Filters</span>
            </button>
          </form>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          <CategoryLink icon="celebration" label="Event Staff" onClick={() => handleCategoryClick("Event Staff")} />
          <CategoryLink icon="restaurant" label="Hospitality" onClick={() => handleCategoryClick("Hospitality")} />
          <CategoryLink icon="engineering" label="General Labor" onClick={() => handleCategoryClick("General Labor")} />
          <CategoryLink icon="edit_note" label="Administrative" onClick={() => handleCategoryClick("Administrative")} />
          <CategoryLink icon="local_shipping" label="Warehouse" onClick={() => handleCategoryClick("Warehouse")} />
          <CategoryLink icon="store" label="Retail" onClick={() => handleCategoryClick("Retail")} />
          <CategoryLink icon="delivery_dining" label="Delivery" onClick={() => handleCategoryClick("Delivery")} />
          <CategoryLink icon="cleaning_services" label="Cleaning" onClick={() => handleCategoryClick("Cleaning")} />
          <CategoryLink icon="construction" label="Construction" onClick={() => handleCategoryClick("Construction")} />
          <button
            type="button"
            onClick={() => navigate("/client/browse-staff")}
            className="group flex flex-col items-center justify-center text-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary dark:bg-primary/20 dark:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <span className="material-symbols-outlined text-2xl sm:text-3xl">add</span>
            <h4 className="text-xs sm:text-sm font-semibold">View All</h4>
          </button>
        </div>
      </section>
    </main>
  );
};

const RecommendedCard = ({ member }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all">
      <img
        alt={member.name}
        src={member.image_url || defaultWorkerAvatar}
        className="w-full h-32 sm:h-40 object-cover"
        onError={(e) => {
          e.target.src = defaultWorkerAvatar;
        }}
      />
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
          {member.name}
        </h3>
        <p className="text-xs sm:text-sm text-primary font-medium truncate">{member.role}</p>
        <div className="flex items-center gap-1 text-yellow-500 mt-2">
          <span
            className="material-symbols-outlined !text-sm sm:!text-base !leading-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
            {parseFloat(member.rating || 0).toFixed(1)}{" "}
            <span className="text-gray-400 font-normal">
              ({member.rating_count || 0})
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/client/staff/${member.id}`)}
          className="w-full mt-3 sm:mt-4 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 sm:h-9 px-3 sm:px-4 bg-primary/10 text-primary text-xs sm:text-sm font-bold hover:bg-primary/20 transition-colors whitespace-nowrap"
        >
          <span>View Profile</span>
        </button>
      </div>
    </div>
  );
};

const CategoryLink = ({ icon, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center justify-center text-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1"
    >
      <span className="material-symbols-outlined text-2xl sm:text-3xl text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">
        {icon}
      </span>
      <h4 className="text-xs sm:text-sm font-semibold">{label}</h4>
    </button>
  );
};

export default Dashboard;
