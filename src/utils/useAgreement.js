import axiosInstance from "./axiosInstance";

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
