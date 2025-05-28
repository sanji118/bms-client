import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FiPlus, FiTrash2, FiEdit, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCoupons,
  createCoupon,
  updateCouponStatus,
  updateCoupon,
  deleteCoupon
} from "../utils"; 
import EditCouponModal from "./EditCouponModal";

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercentage: "",
    description: "",
    isActive: true,
    expiryDate: ""
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getCoupons();
        setCoupons(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coupons:', error);
        setLoading(false);
        Swal.fire('Error!', 'Failed to load coupons. Please try again later.', 'error');
      }
    };

    fetchCoupons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCoupon(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setNewCoupon({
      code: "",
      discountPercentage: "",
      description: "",
      isActive: true,
      expiryDate: ""
    });
    setCurrentCoupon(null);
    setIsEditing(false);
  };

  const handleSubmitCoupon = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentCoupon) {
        const updatedCoupon = await updateCoupon(currentCoupon._id, newCoupon);
        setCoupons(coupons.map(coupon => coupon._id === currentCoupon._id ? updatedCoupon : coupon));
        Swal.fire('Updated!', 'Coupon has been updated successfully.', 'success');
      } else {
        const createdCoupon = await createCoupon(newCoupon);
        setCoupons([...coupons, createdCoupon]);
        Swal.fire('Success!', 'Coupon has been added successfully.', 'success');
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Failed to process coupon.', 'error');
    }
  };

  const handleEditCoupon = (coupon) => {
    setCurrentCoupon(coupon);
    setIsEditing(true);
    setNewCoupon({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      description: coupon.description,
      isActive: coupon.isActive,
      expiryDate: coupon.expiryDate || ""
    });
    setShowModal(true);
  };

  const handleDeleteCoupon = async (couponId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      backdrop: 'rgba(0,0,0,0.7)'
    });

    if (result.isConfirmed) {
      try {
        await deleteCoupon(couponId);
        setCoupons(coupons.filter(coupon => coupon._id !== couponId));
        Swal.fire('Deleted!', 'The coupon has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete coupon. Please try again.', 'error');
      }
    }
  };

  const toggleCouponStatus = async (couponId, currentStatus) => {
    try {
      const updatedCoupon = await updateCouponStatus(couponId, !currentStatus);
      setCoupons(coupons.map(coupon => coupon._id === couponId ? updatedCoupon : coupon));
      Swal.fire('Status Updated!', `Coupon is now ${!currentStatus ? 'active' : 'inactive'}`, 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to update coupon status.', 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Coupons</h1>
          <p className="text-gray-600">Create, edit, and delete discount coupons</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
        >
          <FiPlus /> Add Coupon
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading coupons...</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Code</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Discount</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Expiry</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.length ? coupons.map(coupon => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{coupon.code}</td>
                  <td className="px-6 py-4">{coupon.discountPercentage}%</td>
                  <td className="px-6 py-4 text-gray-600">{coupon.description}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleCouponStatus(coupon._id, coupon.isActive)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No expiry'}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <p className="mt-2">No coupons found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <EditCouponModal
            isEditing={isEditing}
            newCoupon={newCoupon}
            handleInputChange={handleInputChange}
            handleSubmitCoupon={handleSubmitCoupon}
            setShowModal={setShowModal}
            resetForm={resetForm}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManageCoupons;