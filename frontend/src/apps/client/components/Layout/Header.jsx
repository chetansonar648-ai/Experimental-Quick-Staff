import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import defaultClientAvatar from "../../../../assets/client_default_avatar.png";

const pageTitleMap = {
  "/": "Dashboard",
  "/browse-staff": "Browse Staff",
  "/bookings": "My Bookings",
  "/bookings/upcoming": "Upcoming Bookings",
  "/bookings/active": "Active Bookings",
  "/bookings/completed": "Completed Jobs",
  "/bookings/cancelled": "Cancelled Jobs",
  "/bookings/reviews": "Pending Reviews",
  "/saved-workers": "Saved Workers",
  "/payments/history": "Payment History",
  "/payments/receipt": "Receipt",
  "/profile": "My Profile"
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitleMap[location.pathname] || "Client Dashboard";

  const [user, setUser] = React.useState({
    name: "Client",
    image: defaultClientAvatar
  });

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
        if (!token) return;

        const response = await fetch("/api/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser({
              name: data.user.full_name || "Client",
              image: data.user.profile_image_url || defaultClientAvatar
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
        </div>
        <div className="flex items-center gap-6">

          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            onClick={() => navigate("/client/profile")}
          >
            <img
              alt="Client Avatar"
              className="size-9 rounded-full object-cover border border-gray-200 dark:border-gray-700 bg-gray-100"
              src={user.image && (user.image.startsWith("http") || user.image.startsWith("/")) ? user.image : `/${user.image || defaultClientAvatar}`}
              onError={(e) => {
                e.target.src = defaultClientAvatar;
              }}
            />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


