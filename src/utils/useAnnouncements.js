import axiosInstance from "./axiosInstance";

export const getAnnouncements = async () => {
  try {
    const response = await axiosInstance.get("/announcements");
    return response.data;
  } catch (error) {
    //console.error("Failed to get announcements:", error);
    throw error;
  }
};

export const createAnnouncement = async (announcementData) => {
  try {
    const response = await axiosInstance.post("/announcements", announcementData);
    return response.data;
  } catch (error) {
    //console.error("Failed to create announcement:", error);
    throw error;
  }
};

export const updateAnnouncement = async (id, announcementData) => {
  try {
    const response = await axiosInstance.put(`/announcements/${id}`, announcementData);
    return response.data;
  } catch (error) {
    //console.error("Failed to update announcement:", error);
    throw error;
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const response = await axiosInstance.delete(`/announcements/${id}`);
    return response.data;
  } catch (error) {
    //console.error("Failed to delete announcement:", error);
    throw error;
  }
};

