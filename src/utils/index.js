import axiosInstance from "./axiosInstance";


// User related functions
export const saveUserToDB = async (user) => {
  if (!user?.email) return;

  const userInfo = {
    name: user.displayName || "No Name",
    email: user.email,
    photo: user.photoURL || "",
    role: "user",
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

export const updateUserRole = async (email, role) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${email}`, { role });
    return response.data;
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw error;
  }
};

// Apartment related functions
export const getApartments = async () => {
  try {
    const response = await axiosInstance.get("/apartments");
    return response.data;
  } catch (error) {
    console.error("Failed to get apartments:", error);
    throw error;
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

// Agreement related functions
export const getAgreements = async (email) => {
  try {
    const response = await axiosInstance.get("/agreements", {
      params: { email }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get agreements:", error);
    throw error;
  }
};

export const getAgreementRequests = async () => {
  try {
    const response = await axiosInstance.get("/agreements/requests");
    return response.data;
  } catch (error) {
    console.error("Failed to get agreement requests:", error);
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
export const getPayments = async (email) => {
  try {
    const response = await axiosInstance.get("/payments", {
      params: { email }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get payments:", error);
    throw error;
  }
};

export const processPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post("/payments", paymentData);
    return response.data;
  } catch (error) {
    console.error("Failed to process payment:", error);
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

export const updateAnnouncement = async(id, payload)=>{
    const response = await axiosInstance.put(`/announcements/${id}`, payload);
    return response.data;
}

export const deleteAnnouncement = async (id) => {
  const response = await axiosInstance.delete(`/announcements/${id}`);
  return response.data
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

export const getCouponByCode = async (code) => {
  try {
    const response = await axiosInstance.get(`/coupons/${code}`);
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

export const updateCouponStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/coupons/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Failed to update coupon status:", error);
    throw error;
  }
};

export const updateCoupon = async (id, updatedData) => {
  try {
    const response = await axiosInstance.patch(`/coupons/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Failed to update coupon:", error);
    throw error;
  }
};

export const deleteCoupon = async (id) => {
  try {
    const response = await axiosInstance.delete(`/coupons/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Admin specific functions
export const getAdminStats = async () => {
  try {
    const response = await axiosInstance.get("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Failed to get admin stats:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("Failed to get users:", error);
    throw error;
  }
};


// Format date for display
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Get current month in YYYY-MM format
export const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};