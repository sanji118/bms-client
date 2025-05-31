import axiosInstance from "./axiosInstance";

export const getCoupons = async () => {
  try {
    const response = await axiosInstance.get("/coupons");
    return response.data;
  } catch (error) {
    //console.error("Failed to get coupons:", error);
    throw error;
  }
};

export const getCouponById = async (id) => {
  try {
    const response = await axiosInstance.get(`/coupons/${id}`);
    return response.data;
  } catch (error) {
    //console.error("Failed to get coupon:", error);
    throw error;
  }
};

export const createCoupon = async (couponData) => {
  try {
    const response = await axiosInstance.post("/coupons", couponData);
    return response.data;
  } catch (error) {
    //console.error("Failed to create coupon:", error);
    throw error;
  }
};

export const updateCoupon = async (id, couponData) => {
  try {
    const response = await axiosInstance.patch(`/coupons/${id}`, couponData);
    return response.data;
  } catch (error) {
    //console.error("Failed to update coupon:", error);
    throw error;
  }
};

export const updateCouponStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/coupons/${id}/status`, { status });
    return response.data;
  } catch (error) {
    //console.error("Failed to update coupon status:", error);
    throw error;
  }
};

export const deleteCoupon = async (id) => {
  try {
    const response = await axiosInstance.delete(`/coupons/${id}`);
    return response.data;
  } catch (error) {
    //console.error("Failed to delete coupon:", error);
    throw error;
  }
};

export const applyCoupon = async (code) => {
  try {
    const response = await axiosInstance.post("/coupons/apply", { code });
    return response.data;
  } catch (error) {
    //console.error("Failed to apply coupon:", error);
    throw error;
  }
};