import axiosInstance from "./axiosInstance";


// Admin functions
export const getAdminStats = async () => {
  try {
    const response = await axiosInstance.get("/admin-stats");
    return response.data;
  } catch (error) {
    // //console.error("Failed to get admin stats:", error);
    throw error;
  }
};



// Utility functions
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
};

export const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getStatusBadgeColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'rejected':
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};