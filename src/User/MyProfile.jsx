import { useEffect, useState } from "react";
import { useAuth } from "../hook/useAuth";
import axiosInstance from "../utils/axiosInstance";
import tokenStorage from "../utils/tokenStorage";
import { FiUser, FiHome, FiCalendar, FiDollarSign, FiAlertCircle } from "react-icons/fi";
import { PulseLoader } from "react-spinners";

const MyProfile = () => {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = tokenStorage.getToken();

  useEffect(() => {
    const fetchData = async () => {
      if (user?.email && token) {
        try {
          setLoading(true);
          const result = await axiosInstance.get('/agreements');
          setAgreements(result.data);
        } catch (err) {
          console.error("Error fetching agreements:", err);
          setError("Failed to load agreement data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user, token]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-xl shadow-lg mb-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img 
              src={user?.photoURL || "https://i.ibb.co/M1q7YgV/default-user.png"} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <span className="absolute bottom-0 right-0 bg-yellow-600 text-white rounded-full p-2">
              <FiUser className="text-lg" />
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{user?.displayName || "Guest User"}</h2>
            <p className="text-yellow-100">{user?.email || "No email provided"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
          agreements.map((agreement, index) => (
            <div key={index} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        ${agreement.rent ? (agreement.rent.$numberInt || agreement.rent) : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={getStatusBadge(agreement.status)}>
                        {agreement.status || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Request Date</span>
                    <span className="font-medium">{formatDate(agreement.requestDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created At</span>
                    <span className="font-medium">
                      {formatDate(agreement.createdAt?.$date ? new Date(agreement.createdAt.$date.$numberLong) : null)}
                    </span>
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
              <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                Apply for an Apartment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;