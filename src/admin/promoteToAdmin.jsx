import axiosInstance from './axiosInstance';
import toast from 'react-hot-toast';

const promoteToAdmin = async (email) => {
  try {
    const res = await axiosInstance.put(`/users/make-admin/${email}`);
    toast.success(res.data.message || 'User promoted to admin!');
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || 'Failed to promote user');
  }
};

export default promoteToAdmin;
