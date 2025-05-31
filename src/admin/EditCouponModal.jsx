
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const EditCouponModal = ({
  isEditing,
  newCoupon,
  handleInputChange,
  handleSubmitCoupon,
  setShowModal,
  resetForm,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-lg"
      >
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-blue-400">{isEditing ? 'Edit Coupon' : 'Add Coupon'}</h2>
          <button 
            onClick={() => { setShowModal(false); resetForm(); }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmitCoupon} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coupon Code *</label>
            <input
              type="text"
              name="code"
              value={newCoupon.code}
              onChange={handleInputChange}
              required
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="WINTER25"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount Percentage *</label>
            <div className="relative">
              <input
                type="number"
                name="discountPercentage"
                value={newCoupon.discountPercentage}
                onChange={handleInputChange}
                min="1"
                max="100"
                required
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="25"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={newCoupon.description}
              onChange={handleInputChange}
              required
              rows="3"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Short description of the coupon"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={newCoupon.expiryDate}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={newCoupon.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium">Active Coupon</label>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
            >
              {isEditing ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditCouponModal;
