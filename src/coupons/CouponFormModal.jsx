import { useState, useEffect } from 'react';
import { FaPercentage, FaDollarSign, FaCalendarAlt, FaTags } from 'react-icons/fa';
import { FiX, FiCheck, FiInfo } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';

const CouponFormModal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  formData, 
  setFormData, 
  handleSubmit, 
  loading 
}) => {
  const [isCodeValid, setIsCodeValid] = useState(true);
  const [touchedFields, setTouchedFields] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Validate coupon code in real-time
    if (name === 'code') {
      const isValid = /^[A-Z0-9]+$/.test(value);
      setIsCodeValid(isValid || value === '');
    }
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const getInputClass = (fieldName, isValid) => {
    const baseClass = "input input-bordered w-full transition-all duration-300";
    if (!touchedFields[fieldName]) return baseClass;
    return `${baseClass} ${isValid ? 'input-success' : 'input-error'}`;
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="modal-box w-11/12 max-w-3xl p-0 overflow-hidden shadow-2xl"
          >
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Create New Coupon</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-circle btn-ghost btn-sm"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
              <p className="text-sm opacity-90 mt-1">
                Fill in the details to create a new discount coupon
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coupon Code */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Coupon Code</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('code')}
                      placeholder="SUMMER20"
                      className={getInputClass('code', isCodeValid)}
                      pattern="[A-Z0-9]+"
                      required
                    />
                    {touchedFields.code && (
                      <span className={`absolute right-3 top-3 ${isCodeValid ? 'text-green-500' : 'text-red-500'}`}>
                        {isCodeValid ? <FiCheck /> : <FiX />}
                      </span>
                    )}
                  </div>
                  {touchedFields.code && !isCodeValid && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <FiInfo className="mr-1" /> Only uppercase letters and numbers allowed
                    </p>
                  )}
                </div>

                {/* Discount Type */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Discount Type</span>
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-200">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 flex items-center justify-center transition-colors ${
                        formData.type === 'percentage' 
                          ? 'bg-cyan-100 text-cyan-700 border-r border-cyan-200' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setFormData({...formData, type: 'percentage'})}
                    >
                      <FaPercentage className="mr-2" /> Percentage
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 flex items-center justify-center transition-colors ${
                        formData.type === 'fixed' 
                          ? 'bg-blue-100 text-blue-700 border-l border-blue-200' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setFormData({...formData, type: 'fixed'})}
                    >
                      <FaDollarSign className="mr-2" /> Fixed Amount
                    </button>
                  </div>
                </div>

                {/* Discount Value */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Discount Value</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      {formData.type === 'percentage' ? (
                        <FaPercentage />
                      ) : (
                        <FaDollarSign />
                      )}
                    </div>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('discount')}
                      className="input input-bordered w-full pl-10"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Validity Period */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Validity Period</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaCalendarAlt />
                    </div>
                    <DatePicker
                      selected={formData.validity[0]}
                      onChange={(dates) => setFormData({ ...formData, validity: dates })}
                      startDate={formData.validity[0]}
                      endDate={formData.validity[1]}
                      selectsRange
                      className="input input-bordered w-full pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Minimum Amount */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Minimum Amount</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaDollarSign />
                    </div>
                    <input
                      type="number"
                      name="minAmount"
                      value={formData.minAmount}
                      onChange={handleInputChange}
                      className="input input-bordered w-full pl-10"
                      min="0"
                    />
                  </div>
                </div>

                {/* Applicable For */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Applicable For</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none text-gray-400">
                      <FaTags />
                    </div>
                    <select
                      name="applicableFor"
                      multiple
                      value={formData.applicableFor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          applicableFor: Array.from(e.target.selectedOptions, (opt) => opt.value)
                        })
                      }
                      className="select select-bordered w-full pl-10 h-auto min-h-[3rem]"
                      required
                    >
                      <option value="new-members">New Members</option>
                      <option value="renewals">Renewals</option>
                      <option value="special-offers">Special Offers</option>
                    </select>
                  </div>
                </div>

                {/* Reusable */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <span className="label-text font-medium">Reusable Coupon</span>
                    <input
                      type="checkbox"
                      name="reusable"
                      checked={formData.reusable}
                      onChange={handleInputChange}
                      className="toggle toggle-primary"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Allow this coupon to be used multiple times by the same customer
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="form-control mt-6">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-24 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="Enter coupon description that will be shown to customers..."
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="modal-action mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-none ${
                    loading ? 'opacity-70' : 'hover:opacity-90'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'Create Coupon'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CouponFormModal;