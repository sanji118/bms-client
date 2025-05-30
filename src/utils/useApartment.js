import axiosInstance from "./axiosInstance";

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
