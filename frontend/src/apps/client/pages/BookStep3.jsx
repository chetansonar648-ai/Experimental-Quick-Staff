import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import defaultWorkerAvatar from "../../../assets/worker_default_avatar.png";

const BookStep3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { worker, service, date, time, location: serviceLocation, duration, instructions } = location.state || {};


  React.useEffect(() => {
    if (!worker || !date || !time) {
      navigate("/client/browse-staff");
    }
  }, [worker, date, time, navigate]);

  if (!worker) return null;

  const workerName = worker.name;
  const workerRole = worker.role;
  const workerImage = worker.image_url;

  const formattedDate = date && time
    ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ` at ${time}`
    : "";

  const bookingLocation = serviceLocation;
  const bookingInstructions = instructions || "None provided";

  const hourlyRate = worker?.hourly_rate || 25;
  const bookingDuration = parseInt(duration || 4);
  const subtotal = hourlyRate * bookingDuration;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {

      let time24 = time;
      if (time && (time.includes('AM') || time.includes('PM'))) {
        const [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        time24 = `${hours}:${minutes}:00`;
      } else if (time && time.split(':').length === 2) {
        time24 = `${time}:00`;
      }

      const bookingDateTime = new Date(`${date}T${time24}`);
      if (isNaN(bookingDateTime.getTime())) {
        throw new Error(`Invalid Date/Time: ${date} ${time} (Parsed: ${date}T${time24})`);
      }



      const token = localStorage.getItem('token') || localStorage.getItem('qs_token');

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          worker_id: worker.id,
          service_id: null,

          booking_date: bookingDateTime.toISOString(),
          duration_hours: bookingDuration,
          total_price: subtotal,
          address: bookingLocation,
          special_instructions: bookingInstructions !== "None provided" ? bookingInstructions : null
        })
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/client/book/confirm", {
          state: {
            worker,
            serviceLocation: bookingLocation,
            total: subtotal.toFixed(2),
            formattedDate,
            bookingReference: data.booking?.id || data.booking_reference
          }
        });
      } else {
        const text = await response.text();
        try {
          const err = JSON.parse(text);
          alert(`Booking failed: ${err.message || err.error || "Unknown error"}`);
        } catch (e) {
          alert(`Server Error (${response.status}): ${text.substring(0, 200)}`);
        }
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert(`Network/Client Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <nav>
              <ul className="space-y-4">
                <li>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 dark:bg-primary/30 text-primary font-bold">
                      <span className="material-symbols-outlined">check</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-600 dark:text-gray-300">Date & Time</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                    </div>
                  </div>
                </li>
                <li><div className="h-6 w-px bg-gray-200 dark:bg-gray-700 ml-4"></div></li>
                <li>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 dark:bg-primary/30 text-primary font-bold">
                      <span className="material-symbols-outlined">check</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-600 dark:text-gray-300">Details</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                    </div>
                  </div>
                </li>
                <li><div className="h-6 w-px bg-gray-200 dark:bg-gray-700 ml-4"></div></li>
                <li>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white font-bold">3</div>
                    <div>
                      <h3 className="font-bold text-primary">Confirm Booking</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Review and finalize</p>
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-8">

              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Booking Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <img
                      alt={workerName}
                      className="size-16 rounded-full object-cover border-2 border-white dark:border-gray-800"
                      src={workerImage || defaultWorkerAvatar}
                      onError={(e) => { e.target.src = defaultWorkerAvatar; }}
                    />
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900 dark:text-white">{workerName}</h4>
                      <p className="text-primary font-medium">{workerRole}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{bookingDuration} Hours of Service</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Rate</p>
                      <p className="text-xl font-bold text-primary">${hourlyRate}/hr</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-base text-gray-500 dark:text-gray-400 mt-0.5">calendar_today</span>
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Date & Time</p>
                        <p className="text-gray-500 dark:text-gray-400">{formattedDate}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-base text-gray-500 dark:text-gray-400 mt-0.5">location_on</span>
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Location</p>
                        <p className="text-gray-500 dark:text-gray-400">{bookingLocation}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-base text-gray-500 dark:text-gray-400 mt-0.5">notes</span>
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Instructions</p>
                        <p className="text-gray-500 dark:text-gray-400 italic">"{bookingInstructions}"</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700"></div>



              <div className="pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input className="form-checkbox rounded text-primary focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-gray-900" type="checkbox" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    I have read and agree to the <a className="font-medium text-primary hover:underline" href="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> and <a className="font-medium text-primary hover:underline" href="/cancellation-policy" target="_blank" rel="noopener noreferrer">Cancellation Policy</a>.
                  </span>
                </label>
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
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Confirm Booking</span>
                      <span className="material-symbols-outlined">check_circle</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookStep3;
