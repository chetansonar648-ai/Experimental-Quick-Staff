import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import defaultWorkerAvatar from "../../../assets/worker_default_avatar.png";
import { ToastContainer } from "../../../components/Toast";

const tabs = [
  { key: "upcoming", label: "Upcoming Bookings", icon: "event_upcoming" },
  { key: "active", label: "Active Bookings", icon: "work" },
  { key: "requested", label: "Requested Bookings", icon: "hourglass_top" },
  { key: "past", label: "Past Bookings", icon: "history" },
  { key: "completed", label: "Completed Jobs", icon: "task_alt" },
  { key: "cancelled", label: "Cancelled Jobs", icon: "cancel" },
  { key: "pendingReviews", label: "Pending Reviews", icon: "rate_review" }
];

const MyBookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "upcoming");
  const navigate = useNavigate();
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('qs_token');


      const statusMap = {
        upcoming: "all_active",
        active: "in_progress",
        requested: "pending",
        past: "completed",
        completed: "completed",
        cancelled: "cancelled",
        pendingReviews: "completed"
      };

      const status = statusMap[activeTab];
      if (status) {
        const response = await fetch(`/api/bookings/client?status=${status}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        });
        if (response.ok) {
          const data = await response.json();

          setBookings(prev => ({ ...prev, [activeTab]: data.bookings || data }));
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);


    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };


  const section = useMemo(() => {
    const currentBookings = bookings[activeTab];
    switch (activeTab) {
      case "upcoming":
        return <UpcomingSection bookings={bookings.upcoming} loading={loading} onRefresh={fetchBookings} addToast={addToast} />;
      case "active":
        return <ActiveSection bookings={bookings.active} loading={loading} addToast={addToast} />;
      case "requested":
        return <RequestedSection bookings={bookings.requested} loading={loading} onRefresh={fetchBookings} />;
      case "completed":
        return <CompletedSection bookings={bookings.completed} loading={loading} />;
      case "pendingReviews":
        return <PendingReviewsSection bookings={bookings.pendingReviews} loading={loading} onRefresh={fetchBookings} addToast={addToast} />;
      case "cancelled":
        return <CancelledJobsSection bookings={bookings.cancelled} loading={loading} />;
      case "past":
      default:
        return <PastSection bookings={bookings.past} loading={loading} />;
    }
  }, [activeTab, bookings, loading, addToast]);

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Your Bookings</h2>
        <button
          type="button"
          onClick={() => navigate("/client/book/step-1")}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors gap-2"
        >
          <span className="material-symbols-outlined !text-xl">add</span>
          <span>Create New Booking</span>
        </button>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <nav aria-label="Tabs" className="flex flex-nowrap -mb-px">
          {tabs.map((t) => (
            <Tab
              key={t.key}
              label={t.label}
              icon={t.icon}
              badge={bookings[t.key] ? bookings[t.key].length : t.badge}
              isActive={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
            />
          ))}
        </nav>
      </div>

      <div>{section}</div>


      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </main>
  );
};

const Tab = ({ label, icon, badge, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "shrink-0 px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap",
      isActive
        ? "border-primary text-primary"
        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
    ].join(" ")}
  >
    <span className="material-symbols-outlined !text-xl">{icon}</span>
    {label}
    {badge > 0 && (
      <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full">
        {badge}
      </span>
    )}
  </button>
);


const UpcomingSection = ({ bookings, loading, onRefresh, addToast }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Date (Soonest)");
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  const [viewBooking, setViewBooking] = useState(null);
  const [rescheduleBooking, setRescheduleBooking] = useState(null);

  // Helper to handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
        const response = await fetch(`/api/bookings/${bookingId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: JSON.stringify({ status: "cancelled", cancelled_by: "client", cancellation_reason: "User requested cancellation" })
        });
        if (response.ok) {
          onRefresh();
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    }
  };

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];

    let result = bookings.filter(b => {
      // 1. Search Filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        b.worker_name?.toLowerCase().includes(searchLower) ||
        b.service_type?.toLowerCase().includes(searchLower) ||
        b.status?.toLowerCase().includes(searchLower);


      let matchesDate = true;
      if (selectedDate) {
        matchesDate = b.booking_date.startsWith(selectedDate);
      }

      return matchesSearch && matchesDate;
    });


    result.sort((a, b) => {
      const dateA = new Date(a.booking_date + 'T' + a.start_time);
      const dateB = new Date(b.booking_date + 'T' + b.start_time);

      if (sortOption === "Date (Latest)") {
        return dateB - dateA;
      } else if (sortOption === "Status") {
        return a.status.localeCompare(b.status);
      } else {

        return dateA - dateB;
      }
    });

    return result;
  }, [bookings, searchTerm, sortOption, selectedDate]);


  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + monthOffset);
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const calendarDays = [];

  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const getDayDetails = (day) => {
    if (!day) return { className: "text-transparent pointer-events-none" };

    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    const isSelected = selectedDate === dateStr;
    const hasBooking = bookings && bookings.some(b => b.booking_date.startsWith(dateStr));

    let className = "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative";

    if (isSelected) {
      className = "bg-primary text-white font-bold rounded-lg cursor-pointer shadow-md transform scale-105 transition-all";
    } else if (hasBooking) {
      className = "bg-primary/10 text-primary font-semibold rounded-lg cursor-pointer hover:bg-primary/20";
    }

    return { className, dateStr, hasBooking };
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    if (selectedDate === dateStr) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateStr);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading upcoming bookings...</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return "text-orange-500 bg-orange-500/10";
      case 'accepted': return "text-green-500 bg-green-500/10";
      case 'in_progress': return "text-blue-500 bg-blue-500/10";
      case 'completed': return "text-gray-500 bg-gray-500/10";
      case 'cancelled': return "text-red-500 bg-red-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[400px] flex-shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl h-fit">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{currentMonthName}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMonthOffset(prev => prev - 1)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              <span className="material-symbols-outlined !text-xl">chevron_left</span>
            </button>
            <button
              onClick={() => setMonthOffset(prev => prev + 1)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              <span className="material-symbols-outlined !text-xl">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {calendarDays.map((day, idx) => {
            const { className, hasBooking } = getDayDetails(day);
            return (
              <div
                key={idx}
                onClick={() => handleDayClick(day)}
                className={`py-2 flex items-center justify-center ${className}`}
              >
                {day || "-"}
                {hasBooking && !className.includes("bg-primary text-white") && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6 space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Legend</h3>
          <div className="flex items-center gap-2"><div className="size-3 rounded-full bg-blue-500"></div><span className="text-sm text-gray-600 dark:text-gray-300">Selected Date</span></div>
          <div className="flex items-center gap-2"><div className="size-3 rounded-full bg-primary/20"></div><span className="text-sm text-gray-600 dark:text-gray-300">Has Booking</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <SearchRow
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        {selectedDate && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm w-fit animate-fadeIn">
            <span className="material-symbols-outlined !text-lg">filter_alt</span>
            <span>Showing bookings for {new Date(selectedDate).toLocaleDateString()}</span>
            <button onClick={() => setSelectedDate(null)} className="ml-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full p-0.5">
              <span className="material-symbols-outlined !text-lg">close</span>
            </button>
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="flex justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-gray-300">event_busy</span>
            </div>
            <p className="text-gray-500 font-medium">
              {selectedDate ? `No bookings found on ${new Date(selectedDate).toLocaleDateString()}.` : (bookings && bookings.length > 0 ? "No bookings match your search." : "No upcoming bookings found.")}
            </p>
            {(!bookings || bookings.length === 0) && (
              <button
                onClick={() => navigate("/client/browse-staff")}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90"
              >
                Book a Service
              </button>
            )}
            {selectedDate && bookings && bookings.length > 0 && (
              <button
                onClick={() => setSelectedDate(null)}
                className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200"
              >
                Clear Date Filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <img
                    alt={booking.worker_name}
                    className="size-16 rounded-full object-cover"
                    src={booking.worker_image || defaultWorkerAvatar}
                    onError={(e) => { e.target.src = defaultWorkerAvatar; }}
                  />
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{booking.worker_name}</h3>
                        <p className="font-medium text-primary">{booking.service_type} - {booking.worker_role}</p>
                      </div>
                      <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full mt-2 sm:mt-0 ${getStatusColor(booking.status)}`}>
                        <span className="material-symbols-outlined !text-base">event</span>
                        <span className="capitalize">{booking.status}</span>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined !text-xl text-gray-400">calendar_today</span><span>{new Date(booking.booking_date).toLocaleDateString()}</span></div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined !text-xl text-gray-400">schedule</span><span>{booking.start_time}</span></div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined !text-xl text-gray-400">location_on</span><span>{booking.location_address}</span></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setViewBooking(booking)}
                    className="w-full sm:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    View Full Details
                  </button>
                  <div className="relative w-full sm:w-auto ml-auto group">
                    <button className="w-full sm:w-auto flex items-center gap-1 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-9 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors whitespace-nowrap">
                      <span>Manage Booking</span>
                      <span className="material-symbols-outlined !text-base">expand_more</span>
                    </button>
                    <div className="absolute right-0 bottom-full mb-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                      >
                        Cancel Booking
                      </button>
                      <button
                        onClick={() => setRescheduleBooking(booking)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {
        viewBooking && (
          <ViewBookingModal booking={viewBooking} onClose={() => setViewBooking(null)} />
        )
      }

      {
        rescheduleBooking && (
          <RescheduleModal
            booking={rescheduleBooking}
            onClose={() => setRescheduleBooking(null)}
            onSuccess={() => {
              setRescheduleBooking(null);
              onRefresh();
            }}
            addToast={addToast}
          />
        )
      }
    </div >
  );
};

const ActiveSection = ({ bookings, loading, onRefresh, addToast }) => {
  const [viewBooking, setViewBooking] = useState(null);
  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    if (!searchTerm) return bookings;

    const lowerTerm = searchTerm.toLowerCase();
    return bookings.filter(b =>
      b.worker_name?.toLowerCase().includes(lowerTerm) ||
      b.service_type?.toLowerCase().includes(lowerTerm) ||
      b.location_address?.toLowerCase().includes(lowerTerm)
    );
  }, [bookings, searchTerm]);


  const handleCancelBooking = async (bookingId) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
        const response = await fetch(`/api/bookings/${bookingId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: JSON.stringify({ status: "cancelled", cancelled_by: "client", cancellation_reason: "User requested cancellation" })
        });
        if (response.ok) {
          onRefresh();
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return "text-orange-500 bg-orange-500/10";
      case 'accepted': return "text-green-500 bg-green-500/10";
      case 'in_progress': return "text-blue-500 bg-blue-500/10";
      case 'completed': return "text-gray-500 bg-gray-500/10";
      case 'cancelled': return "text-red-500 bg-red-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading active bookings...</div>;

  if (!bookings || bookings.length === 0) return <div className="p-8 text-center text-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">No active bookings found.</div>;


  return (
    <div className="space-y-6">
      <SearchRow simple searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No active bookings match "{searchTerm}".
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
              <div className="p-5 flex-grow">
                <div className="flex items-start gap-4 mb-4">
                  <img alt={booking.worker_name} className="size-14 rounded-full object-cover" src={booking.worker_image || defaultWorkerAvatar} onError={(e) => { e.target.src = defaultWorkerAvatar; }} />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{booking.worker_name}</h3>
                    <p className="text-sm text-primary font-medium">{booking.service_type}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <span className="material-symbols-outlined !text-xl">calendar_today</span>
                    <span>{new Date(booking.booking_date).toLocaleDateString()} - {booking.start_time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <span className="material-symbols-outlined !text-xl">location_on</span>
                    <span>{booking.location_address}</span>
                  </div>
                  <div className="flex items-center gap-3 font-medium">
                    <span className="material-symbols-outlined !text-xl text-yellow-500">route</span>
                    <span className={`px-2 py-0.5 rounded-md capitalize ${getStatusColor(booking.status)}`}>{booking.status}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => setViewBooking(booking)}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  View Details
                </button>
                <div className="relative group">
                  <button className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
                    Manage Booking
                  </button>
                  <div className="absolute right-0 bottom-full mb-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                    >
                      Cancel Booking
                    </button>
                    <button
                      onClick={() => setRescheduleBooking(booking)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewBooking && (
        <ViewBookingModal booking={viewBooking} onClose={() => setViewBooking(null)} />
      )}

      {rescheduleBooking && (
        <RescheduleModal
          booking={rescheduleBooking}
          onClose={() => setRescheduleBooking(null)}
          onSuccess={() => {
            setRescheduleBooking(null);
            onRefresh();
          }}
          addToast={addToast}
        />
      )}
    </div>
  );
};

const RequestedSection = ({ bookings = [], loading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("All Services");
  const [filterStatus, setFilterStatus] = useState("Any Status");
  const [filterDate, setFilterDate] = useState("");
  const [viewBooking, setViewBooking] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return "text-orange-500 bg-orange-500/10";
      case 'reviewing': return "text-blue-500 bg-blue-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const handleWithdraw = async (bookingId) => {
    if (confirm("Are you sure you want to withdraw this booking request?")) {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
        const response = await fetch(`/api/bookings/${bookingId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: JSON.stringify({ status: "cancelled", cancelled_by: "client", cancellation_reason: "Withdrawn by client" })
        });
        if (response.ok) {
          if (onRefresh) onRefresh();
        }
      } catch (error) {
        console.error("Error withdrawing booking:", error);
      }
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        b.worker_name?.toLowerCase().includes(searchLower) ||
        b.service_type?.toLowerCase().includes(searchLower);

      let matchesService = true;
      if (filterService !== "All Services") {
        matchesService = b.service_type === filterService;
      }

      let matchesStatus = true;
      if (filterStatus !== "Any Status") {
        if (filterStatus === "Pending") matchesStatus = b.status === "pending";
        if (filterStatus === "Worker Reviewing") matchesStatus = b.status === "reviewing";
      }

      let matchesDate = true;
      if (filterDate) {
        matchesDate = b.booking_date.startsWith(filterDate);
      }

      return matchesSearch && matchesService && matchesStatus && matchesDate;
    });
  }, [bookings, searchTerm, filterService, filterStatus, filterDate]);

  // Extract unique services
  const services = ["All Services", ...new Set(bookings.map(b => b.service_type))];

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No requested bookings at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-gray-900/50 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary text-sm"
              placeholder="Search by worker, service..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            <select
              className="w-full sm:w-auto pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary text-sm"
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
            >
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              className="w-full sm:w-auto pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>Any Status</option>
              <option>Pending</option>
              <option>Worker Reviewing</option>
            </select>
            <input
              className="w-full sm:w-auto pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary text-sm"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      {filteredBookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No bookings match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredBookings.map((booking) => {
            // Simplified status logic for layout consistency
            const statusColor = getStatusColor(booking.status);

            return (
              <div key={booking.id} className="bg-white dark:bg-gray-900/50 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    alt="Worker Profile"
                    className="w-12 sm:w-16 h-12 sm:h-16 rounded-full object-cover"
                    src={booking.worker_image || defaultWorkerAvatar}
                    onError={(e) => { e.target.src = defaultWorkerAvatar; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                      {booking.worker_name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                      {booking.service_type}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-1 rounded-full flex-shrink-0 ${statusColor}`}>
                    <span className="material-symbols-outlined !text-base">{booking.status === 'reviewing' ? 'visibility' : 'hourglass_top'}</span>
                    <span className="capitalize">{booking.status}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{new Date(booking.booking_date).toLocaleDateString()}</p>
                    <p>{booking.start_time} {booking.end_time ? `- ${booking.end_time}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setViewBooking(booking)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleWithdraw(booking.id)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-500/20 transition-colors"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewBooking && (
        <ViewBookingModal booking={viewBooking} onClose={() => setViewBooking(null)} />
      )}
    </div>
  );
};

const PastSection = ({ bookings = [], loading }) => {
  const [viewBooking, setViewBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return "text-gray-500 bg-gray-500/10";
      case 'cancelled': return "text-red-500 bg-red-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    if (!searchTerm) return bookings;
    const lowerTerm = searchTerm.toLowerCase();
    return bookings.filter(b =>
      b.worker_name?.toLowerCase().includes(lowerTerm) ||
      b.service_type?.toLowerCase().includes(lowerTerm) ||
      b.location_address?.toLowerCase().includes(lowerTerm)
    );
  }, [bookings, searchTerm]);

  if (loading) return <div className="text-center py-8 text-gray-500">Loading past bookings...</div>;
  if (!bookings || bookings.length === 0) return <div className="p-8 text-center text-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">No past bookings found.</div>;

  return (
    <div className="space-y-6">
      <SearchRow simple searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No past bookings match "{searchTerm}".</div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} onClick={() => setViewBooking(booking)} className="cursor-pointer transition-transform hover:scale-[1.01]">
              <BookingCard
                name={booking.worker_name}
                role={`${booking.service_type} - ${booking.worker_role}`}
                status={booking.status}
                statusColor={getStatusColor(booking.status)}
                statusIcon={booking.status === 'completed' ? 'history' : 'cancel'}
                date={new Date(booking.booking_date).toLocaleDateString()}
                time={booking.start_time}
                location={booking.location_address}
                image={booking.worker_image || defaultWorkerAvatar}
              />
            </div>
          ))}
        </div>
      )}

      {viewBooking && (
        <ViewBookingModal booking={viewBooking} onClose={() => setViewBooking(null)} />
      )}
    </div>
  );
};

const CompletedSection = ({ bookings, loading }) => {
  const [viewBooking, setViewBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    if (!searchTerm) return bookings;
    const lowerTerm = searchTerm.toLowerCase();
    return bookings.filter(b =>
      b.worker_name?.toLowerCase().includes(lowerTerm) ||
      b.service_type?.toLowerCase().includes(lowerTerm) ||
      b.location_address?.toLowerCase().includes(lowerTerm)
    );
  }, [bookings, searchTerm]);

  if (loading) return <div className="text-center py-8 text-gray-500">Loading completed jobs...</div>;
  if (!bookings || bookings.length === 0) return <div className="p-8 text-center text-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">No completed jobs found.</div>;

  return (
    <div className="space-y-6">
      <SearchRow simple searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No completed jobs match "{searchTerm}".</div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-1 items-start gap-4">
                  <img alt={booking.worker_name} className="size-14 rounded-full object-cover" src={booking.worker_image || defaultWorkerAvatar} onError={(e) => { e.target.src = defaultWorkerAvatar; }} />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{booking.worker_name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{booking.service_type} - {booking.service_description}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="material-symbols-outlined !text-base text-gray-500">task_alt</span>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{booking.status}</span>
                    </div>
                  </div>
                </div>

              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined !text-xl">calendar_today</span>
                    <span className="font-medium">{new Date(booking.booking_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined !text-xl">location_on</span>
                    <span className="font-medium">{booking.location_address}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setViewBooking(booking)}
                    className="text-primary font-bold hover:underline text-sm mr-4"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/client/book/step-1?workerId=${booking.worker_id}&serviceId=${booking.service_id}`)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 min-w-[84px] cursor-pointer rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined !text-xl">replay</span>
                    <span>Book Again</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewBooking && (
        <ViewBookingModal booking={viewBooking} onClose={() => setViewBooking(null)} />
      )}
    </div>
  );
};

const CancelledJobsSection = ({ bookings, loading }) => {
  const [viewBooking, setViewBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    if (!searchTerm) return bookings;
    const lowerTerm = searchTerm.toLowerCase();
    return bookings.filter(b =>
      b.worker_name?.toLowerCase().includes(lowerTerm) ||
      b.service_type?.toLowerCase().includes(lowerTerm) ||
      b.cancellation_reason?.toLowerCase().includes(lowerTerm)
    );
  }, [bookings, searchTerm]);

  if (loading) return <div className="text-center py-8 text-gray-500">Loading cancelled jobs...</div>;
  if (!bookings || bookings.length === 0) return <div className="p-8 text-center text-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">No cancelled jobs found.</div>;

  return (
    <div className="space-y-6">
      <SearchRow simple searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No cancelled jobs match "{searchTerm}".</div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Worker</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Service</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Cancellation Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Reason</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img alt={booking.worker_name} className="size-10 rounded-full object-cover" src={booking.worker_image || defaultWorkerAvatar} onError={(e) => { e.target.src = defaultWorkerAvatar; }} />
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-200">{booking.worker_name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{parseFloat(booking.worker_rating || 0).toFixed(1)} stars</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{booking.service_type}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{booking.service_description || "Booked Service"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{booking.cancelled_at ? new Date(booking.cancelled_at).toLocaleDateString() : "N/A"}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">by {booking.cancelled_by || "Unknown"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-800 dark:text-gray-200">{booking.cancellation_reason || "No reason provided"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setViewBooking(booking)}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewBooking && (
        <ViewBookingModal booking={viewBooking} onClose={() => setViewBooking(null)} />
      )}
    </div>
  );
};

const PendingReviewsSection = ({ bookings, loading, onRefresh, addToast }) => {
  const [viewBooking, setViewBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  if (loading) return <div className="text-center py-8 text-gray-500">Loading pending reviews...</div>;
  if (!bookings || bookings.length === 0) return <div className="p-8 text-center text-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">No pending reviews found.</div>;

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <img alt={booking.worker_name} className="size-16 rounded-full object-cover" src={booking.worker_image || defaultWorkerAvatar} onError={(e) => { e.target.src = defaultWorkerAvatar; }} />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{booking.worker_name}</h3>
                  <p className="text-primary font-medium">{booking.service_type}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Completed on: {new Date(booking.booking_date).toDateString()}</p>
                </div>
                <div className="mt-3 sm:mt-0 flex gap-3">
                  <button
                    onClick={() => setViewBooking(booking)}
                    className="text-primary font-medium hover:underline text-sm"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setReviewBooking(booking)}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined !text-xl">star</span>
                    <span>Leave a Review</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {viewBooking && (
        <ViewBookingModal booking={viewBooking} onClose={() => setViewBooking(null)} />
      )}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => {
            setReviewBooking(null);
            onRefresh && onRefresh();
            addToast && addToast("Review submitted successfully!");
          }}
        />
      )}
    </div>
  );
};







const SearchRow = ({ simple = false, searchTerm, setSearchTerm, sortOption, setSortOption }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
    <div className="relative w-full md:w-80">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
      <input
        value={searchTerm || ""}
        onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary text-sm"
        placeholder="Search by worker, service..."
        type="text"
      />
    </div>
    {!simple && (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
        <select
          value={sortOption || "Date (Soonest)"}
          onChange={(e) => setSortOption && setSortOption(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary text-sm py-2"
        >
          <option>Date (Soonest)</option>
          <option>Date (Latest)</option>
          <option>Status</option>
        </select>
      </div>
    )}
  </div>
);

const BookingCard = ({ name, role, status, statusColor, date, time, location, image, statusIcon }) => (
  <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
    <div className="flex flex-col sm:flex-row items-start gap-4">
      <img alt={name} className="size-16 rounded-full object-cover" src={image} />
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{name}</h3>
            <p className="font-medium text-primary">{role}</p>
          </div>
          <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full mt-2 sm:mt-0 ${statusColor}`}>
            <span className="material-symbols-outlined !text-base">{statusIcon}</span>
            <span>{status}</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex items-center gap-2"><span className="material-symbols-outlined !text-xl text-gray-400">calendar_today</span><span>{date}</span></div>
          <div className="flex items-center gap-2"><span className="material-symbols-outlined !text-xl text-gray-400">schedule</span><span>{time}</span></div>
          <div className="flex items-center gap-2"><span className="material-symbols-outlined !text-xl text-gray-400">location_on</span><a className="hover:text-primary hover:underline" href="#">{location}</a></div>
        </div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-3">
      <button className="w-full sm:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap">View Full Details</button>
      <div className="relative w-full sm:w-auto ml-auto">
        <button className="w-full sm:w-auto flex items-center gap-1 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-9 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors whitespace-nowrap">
          <span>Manage Booking</span>
          <span className="material-symbols-outlined !text-base">expand_more</span>
        </button>
      </div>
    </div>
  </div>
);

const ActiveCard = ({ name, role, status, statusColor, date, location, image }) => (
  <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
    <div className="p-5 flex-grow">
      <div className="flex items-start gap-4 mb-4">
        <img alt={name} className="size-14 rounded-full object-cover" src={image} />
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{name}</h3>
          <p className="text-sm text-primary font-medium">{role}</p>
        </div>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <span className="material-symbols-outlined !text-xl">calendar_today</span>
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <span className="material-symbols-outlined !text-xl">location_on</span>
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-3 font-medium">
          <span className="material-symbols-outlined !text-xl text-yellow-500">route</span>
          <span className={statusColor}>{status}</span>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 justify-end">
      <button className="flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">View Details</button>
      <button className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">Manage Booking</button>
    </div>
  </div>
);





const ViewBookingModal = ({ booking, onClose }) => {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <span className="material-symbols-outlined text-gray-500">close</span>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Header Info */}
          <div className="flex items-center gap-4">
            <img
              src={booking.worker_image || "https://via.placeholder.com/150"}
              alt={booking.worker_name}
              className="size-20 rounded-full object-cover border-4 border-gray-50 dark:border-gray-800"
              onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
            />
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{booking.worker_name}</h4>
              <p className="text-primary font-medium text-lg">{booking.service_type}</p>
              <p className="text-gray-500 dark:text-gray-400">Reference: <span className="font-mono">{booking.booking_reference || String(booking.id).substring(0, 8)}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">event_note</span>
                Schedule
              </h5>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><span className="font-medium text-gray-700 dark:text-gray-200">Date:</span> {new Date(booking.booking_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><span className="font-medium text-gray-700 dark:text-gray-200">Time:</span> {booking.start_time} - {booking.end_time || "N/A"}</p>
                <p><span className="font-medium text-gray-700 dark:text-gray-200">Duration:</span> {booking.duration_hours || 0} Hours</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                Location
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {booking.location_address}<br />
                {booking.city}, {booking.state} {booking.zip_code}
              </p>
            </div>



            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                Status
              </h5>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm font-bold capitalize
                   ${booking.status === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    booking.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        'bg-gray-100 text-gray-700'
                  }`}>
                  {booking.status}
                </div>
              </div>
            </div>
          </div>

          {booking.cancellation_reason && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
              <p className="font-bold mb-1">Cancellation Reason:</p>
              <p>{booking.cancellation_reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RescheduleModal = ({ booking, onClose, onSuccess, addToast }) => {
  const [date, setDate] = useState(booking.booking_date ? new Date(booking.booking_date).toISOString().split('T')[0] : "");
  const [time, setTime] = useState(booking.start_time || "");
  const [loading, setLoading] = useState(false);

  const handleReschedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
      const response = await fetch(`/api/bookings/${booking.id}/reschedule`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ booking_date: date, start_time: time })
      });

      if (response.ok) {
        const result = await response.json();
        // Show success toast
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
        addToast(`✅ Booking rescheduled to ${formattedDate} at ${time}`, 'success');
        onSuccess();
      } else {
        const error = await response.json();
        addToast(error.message || 'Failed to reschedule booking', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('An error occurred while rescheduling', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800">
        <form onSubmit={handleReschedule} className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reschedule Booking</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Date</label>
              <input
                required
                type="date"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 focus:ring-primary focus:border-primary"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Start Time</label>
              <input
                required
                type="time"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2.5 focus:ring-primary focus:border-primary"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Confirm Reschedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
      const response = await fetch(`/api/bookings/${booking.id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ rating, comment })
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting the review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rate & Review</h3>
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-colors ${star <= rating ? "text-yellow-400 fill-current material-symbols-outlined" : "text-gray-300 material-symbols-outlined"}`}
              >
                star
              </button>
            ))}
          </div>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary resize-none"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyBookings;