import axios from "axios";

export const saveUserToDB = async (user) => {
  if (!user?.email) return;

  const userInfo = {
    name: user.displayName || "No Name",
    email: user.email,
    photo: user.photoURL || "",
    role: "user",
  };

  try {
    const response = await axios.post("http://localhost:5000/users", userInfo);
    return response.data;
  } catch (error) {
    console.error("Failed to save user:", error);
  }
};
