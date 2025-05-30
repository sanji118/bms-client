import axiosInstance from "./axiosInstance";

// User related functions
export const saveUserToDB = async (user) => {
  if (!user?.email) return;

  const userInfo = {
    name: user.displayName || "No Name",
    email: user.email,
    photo: user.photoURL || "",
    role: "user",
    status: "active"
  };

  try {
    const response = await axiosInstance.post("/users", userInfo);
    return response.data;
  } catch (error) {
    console.error("Failed to save user:", error);
    throw error;
  }
};

export const getUser = async (email) => {
  try {
    const response = await axiosInstance.get(`/users/${email}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get user:", error);
    throw error;
  }
};
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error) {
    console.error("Failed to get users:", error);
    throw error;
  }
};

export const promoteToAdmin = async (id) => {
  try {
    const response = await axiosInstance.patch(`/users/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to promote user:", error);
    throw error;
  }
};

export const demoteToUser = async (id) => {
  try {
    const response = await axiosInstance.patch(`/users/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to demote user:", error);
    throw error;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const endpoint = role === 'admin' ? 
      `/users/admin/${id}` : `/users/member/${id}`;
    const response = await axiosInstance.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

export const checkAdmin = async (email) => {
  try {
    const response = await axiosInstance.get(`/users/admin/${email}`);
    return response.data.admin;
  } catch (error) {
    console.error("Failed to check admin status:", error);
    throw error;
  }
};

export const checkMember = async (email) => {
  try {
    const response = await axiosInstance.get(`/users/member/${email}`);
    return response.data.member;
  } catch (error) {
    console.error("Failed to check member status:", error);
    throw error;
  }
};

// Apartment related functions

export const getApartments = async () => {
  try {
    const response = await axiosInstance.get("/apartments");
    if (response.status !== 200) {
      throw new Error('Failed to fetch apartments');
    }
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(error.response?.data?.message || 'Network error');
  }
};

export const getApartment = async (id) => {
  try {
    const response = await axiosInstance.get(`/apartments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get apartment:", error);
    throw error;
  }
};

export const createApartment = async (apartmentData) => {
  try {
    const response = await axiosInstance.post("/apartments", apartmentData);
    return response.data;
  } catch (error) {
    console.error("Failed to create apartment:", error);
    throw error;
  }
};

export const updateApartment = async (id, apartmentData) => {
  try {
    const response = await axiosInstance.patch(`/apartments/${id}`, apartmentData);
    return response.data;
  } catch (error) {
    console.error("Failed to update apartment:", error);
    throw error;
  }
};

export const deleteApartment = async (id) => {
  try {
    const response = await axiosInstance.delete(`/apartments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete apartment:", error);
    throw error;
  }
};

// Coupon related functions
export const getCoupons = async () => {
  try {
    const response = await axiosInstance.get("/coupons");
    return response.data;
  } catch (error) {
    console.error("Failed to get coupons:", error);
    throw error;
  }
};

export const getCouponById = async (id) => {
  try {
    const response = await axiosInstance.get(`/coupons/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get coupon:", error);
    throw error;
  }
};

export const createCoupon = async (couponData) => {
  try {
    const response = await axiosInstance.post("/coupons", couponData);
    return response.data;
  } catch (error) {
    console.error("Failed to create coupon:", error);
    throw error;
  }
};

export const updateCoupon = async (id, couponData) => {
  try {
    const response = await axiosInstance.patch(`/coupons/${id}`, couponData);
    return response.data;
  } catch (error) {
    console.error("Failed to update coupon:", error);
    throw error;
  }
};

export const updateCouponStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/coupons/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Failed to update coupon status:", error);
    throw error;
  }
};

export const deleteCoupon = async (id) => {
  try {
    const response = await axiosInstance.delete(`/coupons/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    throw error;
  }
};

export const applyCoupon = async (code) => {
  try {
    const response = await axiosInstance.post("/coupons/apply", { code });
    return response.data;
  } catch (error) {
    console.error("Failed to apply coupon:", error);
    throw error;
  }
};

// Agreement related functions
export const getAgreements = async () => {
  try {
    const response = await axiosInstance.get("/agreements");
    return response.data;
  } catch (error) {
    console.error("Failed to get agreements:", error);
    throw error;
  }
};

export const getAgreementRequests = async () => {
  try {
    const response = await axiosInstance.get("/agreements");
    return response.data;
  } catch (error) {
    console.error("Failed to get agreements:", error);
    throw error;
  }
};

export const getUserAgreements = async (email) => {
  try {
    const response = await axiosInstance.get(`/agreements/user/${email}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get user agreements:", error);
    throw error;
  }
};

export const createAgreement = async (agreementData) => {
  try {
    const response = await axiosInstance.post("/agreements", agreementData);
    return response.data;
  } catch (error) {
    console.error("Failed to create agreement:", error);
    throw error;
  }
};

export const updateAgreementStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/agreements/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Failed to update agreement status:", error);
    throw error;
  }
};

// Payment related functions
export const getPayments = async () => {
  try {
    const response = await axiosInstance.get("/payments");
    return response.data;
  } catch (error) {
    console.error("Failed to get payments:", error);
    throw error;
  }
};

export const getUserPayments = async (email) => {
  try {
    const response = await axiosInstance.get(`/payments/user/${email}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get user payments:", error);
    throw error;
  }
};

export const createPaymentIntent = async (amount) => {
  try {
    const response = await axiosInstance.post("/create-payment-intent", { amount });
    return response.data.clientSecret;
  } catch (error) {
    console.error("Failed to create payment intent:", error);
    throw error;
  }
};

export const savePayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post("/payments", paymentData);
    return response.data;
  } catch (error) {
    console.error("Failed to save payment:", error);
    throw error;
  }
};

// Announcement related functions
export const getAnnouncements = async () => {
  try {
    const response = await axiosInstance.get("/announcements");
    return response.data;
  } catch (error) {
    console.error("Failed to get announcements:", error);
    throw error;
  }
};

export const createAnnouncement = async (announcementData) => {
  try {
    const response = await axiosInstance.post("/announcements", announcementData);
    return response.data;
  } catch (error) {
    console.error("Failed to create announcement:", error);
    throw error;
  }
};

export const updateAnnouncement = async (id, announcementData) => {
  try {
    const response = await axiosInstance.put(`/announcements/${id}`, announcementData);
    return response.data;
  } catch (error) {
    console.error("Failed to update announcement:", error);
    throw error;
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const response = await axiosInstance.delete(`/announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    throw error;
  }
};



// Admin functions
export const getAdminStats = async () => {
  try {
    const response = await axiosInstance.get("/admin-stats");
    return response.data;
  } catch (error) {
    console.error("Failed to get admin stats:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error) {
    console.error("Failed to get users:", error);
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