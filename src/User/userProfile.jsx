import { useEffect, useState } from "react";
import { useAuth } from "../hook/useAuth";
import {
  getAgreements,
  formatDate,
  formatCurrency,
} from "../utils";
import {
  FiUser,
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiAlertCircle,
  FiPhone,
  FiMail,
  FiClock,
  FiKey,
} from "react-icons/fi";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate()
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agreement, setAgreement] = useState(null);

  useEffect(() => {
    const fetchAgreement = async () => {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        setError(null);
        const agreements = await getAgreements(user.email);
        
        setAgreement(agreements.length > 0 ? agreements[0] : null);
      } catch (err) {
        console.error("Failed to fetch agreements:", err);
        setError("Failed to load agreement data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgreement();
  }, [user?.email]);

  const hasAgreement = agreement && agreement.status === "accepted";

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status?.toLowerCase()) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "accepted":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleApplyForApartment = () => {
    navigate('/apartments')
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-8 rounded-2xl shadow-2xl mb-10">
        <div className="flex items-center gap-8">
          <div className="relative">
            <img
              src={user?.photoURL || "https://i.postimg.cc/bwYZvvQw/wandering-tales-mum8yz-Pu2sk-unsplash.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg bg-none"
              onError={(e) => {
                e.target.src =
                  "https://i.postimg.cc/bwYZvvQw/wandering-tales-mum8yz-Pu2sk-unsplash.png";
              }}
            />
            <span className="absolute bottom-0 right-0 bg-yellow-600 text-white rounded-full p-2 shadow">
              <FiUser className="text-xl" />
            </span>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-white drop-shadow">
              {user?.displayName || "Guest User"}
            </h2>
            <p className="text-yellow-100 text-lg font-medium">
              {user?.email || "No email provided"}
            </p>
            <p className="text-yellow-200 text-sm mt-1 italic">
              Member since {user?.metadata?.creationTime ? formatDate(user.metadata.creationTime) : "unknown date"}
            </p>
          </div>
        </div>
      </div>

      {/* Agreement Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 border border-yellow-200">
        <div className="bg-yellow-500 px-8 py-5">
          <h3 className="text-2xl font-bold text-white">Apartment Agreement</h3>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <PulseLoader color="#eab308" size={12} />
          </div>
        ) : error ? (
          <div className="p-8 flex items-center gap-3 text-red-500">
            <FiAlertCircle className="text-2xl" />
            <p>{error}</p>
          </div>
        ) : hasAgreement ? (
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Apartment Details Card */}
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-yellow-100 p-4 rounded-full">
                    <FiHome className="text-yellow-600 text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">Apartment Details</h4>
                    <p className="text-sm text-gray-500">Your living space info</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Floor</span>
                    <span className="font-medium">{agreement.floor || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Block</span>
                    <span className="font-medium">{agreement.block || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room No</span>
                    <span className="font-medium">{agreement.apartmentNo || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Financial Details Card */}
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-yellow-100 p-4 rounded-full">
                    <FiDollarSign className="text-yellow-600 text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">Financial Details</h4>
                    <p className="text-sm text-gray-500">Payment breakdown</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span className="font-medium">
                      {agreement.rent ? formatCurrency(agreement.rent) : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className={getStatusBadge(agreement.status)}>
                      {agreement.status ? agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1) : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement Timeline */}
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-yellow-100 p-4 rounded-full">
                  <FiCalendar className="text-yellow-600 text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">Agreement Timeline</h4>
                  <p className="text-sm text-gray-500">Your important dates</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Request Date</span>
                  <span className="font-medium">{formatDate(agreement.requestDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium">{formatDate(agreement.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date</span>
                  <span className="font-medium">{formatDate(agreement.endDate)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="bg-yellow-50 rounded-xl p-8 max-w-md mx-auto border border-yellow-100">
              <FiHome className="text-yellow-400 text-5xl mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                {agreement ? "Agreement Pending Approval" : "No Agreement Found"}
              </h4>
              <p className="text-gray-500 mb-4">
                {agreement 
                  ? "Your agreement is being reviewed. You'll be notified once it's approved."
                  : user?.role === "member" 
                    ? "Your agreement details will appear here once approved."
                    : "You don't have any apartment agreements yet."}
              </p>
              <button
                onClick={handleApplyForApartment}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Apply for an Apartment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-200">
        <div className="bg-yellow-500 px-8 py-5">
          <h3 className="text-2xl font-bold text-white">Profile Information</h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Contact Details</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <FiMail /> Email
                </span>
                <span className="font-medium">{user?.email || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <FiPhone /> Phone
                </span>
                <span className="font-medium">{user?.phoneNumber || "Not provided"}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Account Details</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <FiKey /> Account Created
                </span>
                <span className="font-medium">
                  {user?.metadata?.creationTime ? formatDate(user.metadata.creationTime) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <FiClock /> Last Login
                </span>
                <span className="font-medium">
                  {user?.metadata?.lastSignInTime ? formatDate(user.metadata.lastSignInTime) : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;