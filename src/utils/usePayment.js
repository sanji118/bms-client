import axiosInstance from "./axiosInstance";

export const getPayments = async () => {
  try {
    const response = await axiosInstance.get("/payments");
    return response.data;
  } catch (error) {
    //console.error("Failed to get payments:", error);
    throw error;
  }
};

export const getUserPayments = async (email) => {
  try {
    const response = await axiosInstance.get(`/payments/user/${email}`);
    return response.data;
  } catch (error) {
    //console.error("Failed to get user payments:", error);
    throw error;
  }
};

export const createPaymentIntent = async (amount) => {
  try {
    const response = await axiosInstance.post("/create-payment-intent", { amount });
    return response.data.clientSecret;
  } catch (error) {
    //console.error("Failed to create payment intent:", error);
    throw error;
  }
};

export const savePayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post("/payments", paymentData);
    return response.data;
  } catch (error) {
    //console.error("Failed to save payment:", error);
    throw error;
  }
};