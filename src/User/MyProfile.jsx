import { useEffect, useState } from "react";
import { useAuth } from "../hook/useAuth";
import { 
  getAgreements,
  formatDate,
  formatCurrency 
} from "../utils"
import { FiUser, FiHome, FiCalendar, FiDollarSign, FiAlertCircle } from "react-icons/fi";
import { PulseLoader } from "react-spinners";

const MyProfile = () => {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.email) {
        try {
          setLoading(true);
          const result = await getAgreements(user.email);
          setAgreements(result);
        } catch (err) {
          console.error("Error fetching agreements:", err);
          setError("Failed to load agreement data. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status?.toLowerCase()) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'active':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'expired':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleApplyForApartment = () => {
    // You can implement navigation to the application page here
    console.log("Navigate to apartment application");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-xl shadow-lg mb-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img 
              src={user?.photoURL || "https://i.postimg.cc/bwYZvvQw/wandering-tales-mum8yz-Pu2sk-unsplash.png"} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              onError={(e) => {
                e.target.src = "https://i.postimg.cc/bwYZvvQw/wandering-tales-mum8yz-Pu2sk-unsplash.png";
              }}
            />
            <span className="absolute bottom-0 right-0 bg-yellow-600 text-white rounded-full p-2">
              <FiUser className="text-lg" />
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{user?.displayName || "Guest User"}</h2>
            <p className="text-yellow-100">{user?.email || "No email provided"}</p>
            <p className="text-yellow-200 text-sm mt-1">
              Member since {user?.metadata?.creationTime ? formatDate(user.metadata.creationTime) : "unknown date"}
            </p>
          </div>
        </div>
      </div>

      {/* Agreement Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-yellow-500 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Apartment Agreement</h3>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <PulseLoader color="#eab308" size={12} />
          </div>
        ) : error ? (
          <div className="p-6 flex items-center gap-3 text-red-500">
            <FiAlertCircle className="text-xl" />
            <p>{error}</p>
          </div>
        ) : agreements.length > 0 ? (
          agreements.map((agreement) => (
            <div key={agreement._id} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Apartment Details Card */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FiHome className="text-yellow-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Apartment Details</h4>
                      <p className="text-sm text-gray-500">Your living space information</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Floor</span>
                      <span className="font-medium">{agreement.floor || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Block</span>
                      <span className="font-medium">{agreement.block || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room No</span>
                      <span className="font-medium">{agreement.apartmentNo || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Details Card */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FiDollarSign className="text-yellow-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Financial Details</h4>
                      <p className="text-sm text-gray-500">Payment information</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Rent</span>
                      <span className="font-medium">
                        {agreement.rent ? formatCurrency(agreement.rent) : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={getStatusBadge(agreement.status)}>
                        {agreement.status ? agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1) : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreement Timeline Card */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <FiCalendar className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Agreement Timeline</h4>
                    <p className="text-sm text-gray-500">Important dates</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-between md:block">
                    <span className="text-gray-600">Request Date</span>
                    <span className="font-medium">{formatDate(agreement.requestDate)}</span>
                  </div>
                  <div className="flex justify-between md:block">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium">{formatDate(agreement.startDate)}</span>
                  </div>
                  <div className="flex justify-between md:block">
                    <span className="text-gray-600">End Date</span>
                    <span className="font-medium">{formatDate(agreement.endDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="bg-yellow-50 rounded-lg p-6 max-w-md mx-auto">
              <FiHome className="text-yellow-400 text-4xl mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">No Agreement Found</h4>
              <p className="text-gray-500">You don't have any apartment agreements yet.</p>
              <button 
                onClick={handleApplyForApartment}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Apply for an Apartment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Additional Profile Information Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-yellow-500 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Profile Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Contact Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{user?.email || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">{user?.phoneNumber || "Not provided"}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Account Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Created</span>
                  <span className="font-medium">
                    {user?.metadata?.creationTime ? formatDate(user.metadata.creationTime) : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Login</span>
                  <span className="font-medium">
                    {user?.metadata?.lastSignInTime ? formatDate(user.metadata.lastSignInTime) : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;