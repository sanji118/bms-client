import axiosInstance from "./axiosInstance";

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

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error) {
    console.error("Failed to get users:", error);
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