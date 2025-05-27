// layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { FaHome, FaUser, FaBullhorn, FaMoneyBillWave, FaHistory, FaUsers, FaEnvelope, FaGift, FaSignOutAlt, FaUserShield, FaFileContract } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import WebsiteName from "../components/WebsiteName";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userLinks = [
    { path: "profile", name: "My Profile", icon: <FaUser className="text-lg" /> },
    { path: "announcements", name: "Announcements", icon: <FaBullhorn className="text-lg" /> },
  ];

  const memberLinks = [
    { path: "profile", name: "My Profile", icon: <FaUser className="text-lg" /> },
    { path: "make-payment", name: "Make Payment", icon: <FaMoneyBillWave className="text-lg" /> },
    { path: "payment-history", name: "Payment History", icon: <FaHistory className="text-lg" /> },
    { path: "announcements", name: "Announcements", icon: <FaBullhorn className="text-lg" /> },
  ];

  const adminLinks = [
    { path: "profile", name: "Admin Profile", icon: <FaUserShield className="text-lg" /> },
    { path: "manage-members", name: "Manage Members", icon: <FaUsers className="text-lg" /> },
    { path: "make-announcement", name: "Make Announcement", icon: <FaEnvelope className="text-lg" /> },
    { path: "agreement-requests", name: "Agreement Requests", icon: <FaFileContract className="text-lg" /> },
    { path: "manage-coupons", name: "Manage Coupons", icon: <FaGift className="text-lg" /> },
  ];

  const getLinks = () => {
    if (user?.role === "admin") return adminLinks;
    if (user?.role === "member") return memberLinks;
    return userLinks;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        {/* Logo and Brand */}
        <div className="p-4 border-b flex items-center justify-center">
          <Logo />
          <WebsiteName />
        </div>

        {/* User Info */}
        <div className="p-4 border-b flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src={user?.photoURL || "https://i.ibb.co/M1q7YgV/default-user.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-sm">{user?.displayName || "User"}</h3>
            <p className="text-xs text-gray-500 capitalize">{user?.role || "user"}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="space-y-1 px-2">
            {/* Home Link */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-100 text-yellow-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FaHome className="mr-3 text-lg" />
              Home
            </NavLink>

            {/* Dashboard Links */}
            {getLinks().map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-100 text-yellow-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt className="mr-3 text-lg" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;