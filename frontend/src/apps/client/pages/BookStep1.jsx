import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import defaultWorkerAvatar from "../../../assets/worker_default_avatar.png";

const BookStep1 = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get("workerId");
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Form state - removed service selection
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Calendar mock generation
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  useEffect(() => {
    if (workerId) {
      fetch(`/api/workers/${workerId}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch worker");
        })
        .then((data) => {
          setWorker(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      // Fetch categories if starting fresh
      fetch("/api/workers/categories/list")
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [workerId]);

  if (loading) return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading booking...</p>
      </div>
    </main>
  );

  const handleNext = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and time.");
      return;
    }

    // Pass data to Step 2 - no service selection needed
    const params = new URLSearchParams();
    params.append("workerId", workerId);

    navigate(`/client/book/step-2?${params.toString()}`, {
      state: {
        worker,
        service: null, // No service selection
        date: selectedDate,
        time: selectedTimeSlot
      }
    });
  };

  if (!workerId) {
    return (
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Start New Booking</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Select a service to find the perfect professional</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => navigate(`/client/browse-staff?category=${encodeURIComponent(cat.category)}`)}
                className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">category</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{cat.category}</h3>
                <p className="text-sm text-gray-500 mt-1">{cat.count} Professionals</p>
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate("/client/browse-staff")}
              className="text-primary font-bold hover:underline"
            >
              Browse all professionals
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!worker) {
    return <div className="text-center py-12">Worker not found.</div>;
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Worker Header */}
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 mb-8">
          <img
            alt={worker.name}
            className="size-16 rounded-full object-cover border-2 border-white dark:border-gray-800"
            src={worker.image_url || defaultWorkerAvatar}
            onError={(e) => { e.target.src = defaultWorkerAvatar; }}
          />
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">You are booking:</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{worker.name}</h2>
            <p className="text-primary font-medium">{worker.role}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Hourly Rate</p>
            <p className="text-2xl font-bold text-primary">${worker.hourly_rate || 25}/hr</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Steps Nav */}
          <div className="md:col-span-1">
            <nav>
              <ul className="space-y-4">
                <li>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white font-bold">1</div>
                    <div>
                      <h3 className="font-bold text-primary">Date & Time</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Select when you need service</p>
                    </div>
                  </div>
                </li>
                <li><div className="h-6 w-px bg-gray-200 dark:bg-gray-700 ml-4"></div></li>
                <li>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-600 dark:text-gray-300">Details</h3>
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

          {/* Main Content - Only Date & Time selection */}
          <div className="md:col-span-3 space-y-8">
            {/* Select Date & Time */}
            <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Select Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <p className="font-semibold">{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 text-center text-sm text-gray-500 dark:text-gray-400">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="font-medium h-8">{d}</div>)}
                    {Array.from({ length: 35 }).map((_, i) => {
                      const day = i - startDay + 1;
                      const isDate = day > 0 && day <= daysInMonth;
                      const dateStr = isDate ? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : "";
                      const isSelected = selectedDate === dateStr;
                      const isPast = isDate && new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));

                      return (
                        <div key={i} className="h-8">
                          {isDate && (
                            <button
                              onClick={() => !isPast && setSelectedDate(dateStr)}
                              disabled={isPast}
                              className={`size-8 rounded-full flex items-center justify-center transition-colors ${isPast
                                ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                : isSelected
                                  ? "bg-primary text-white font-bold"
                                  : "hover:bg-primary/20"
                                }`}
                            >
                              {day}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timeslots */}
                <div>
                  <p className="font-semibold mb-4 text-center">Available Timeslots</p>
                  <div className="grid grid-cols-2 gap-3">
                    {["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTimeSlot(t)}
                        className={`px-4 py-2 border rounded-md text-center transition-all ${selectedTimeSlot === t
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5"
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span>Continue to Details</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookStep1;
