import { useState } from 'react';
import { FaPercentage, FaDollarSign } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CouponFormModal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  formData, 
  setFormData, 
  handleSubmit, 
  loading 
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  return (
    <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg mb-4">Add New Coupon</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Coupon Code</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="SUMMER20"
                className="input input-bordered"
                pattern="[A-Z0-9]+"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Discount Type</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="select select-bordered"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Discount Value</span>
              </label>
              <div className="relative">
                {formData.type === 'percentage' ? (
                  <FaPercentage className="absolute left-3 top-3" />
                ) : (
                  <FaDollarSign className="absolute left-3 top-3" />
                )}
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="input input-bordered pl-10"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Validity Period</span>
              </label>
              <DatePicker
                selected={formData.validity[0]}
                onChange={(dates) => setFormData({ ...formData, validity: dates })}
                startDate={formData.validity[0]}
                endDate={formData.validity[1]}
                selectsRange
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Minimum Amount</span>
              </label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-3" />
                <input
                  type="number"
                  name="minAmount"
                  value={formData.minAmount}
                  onChange={handleInputChange}
                  className="input input-bordered pl-10"
                  min="0"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Applicable For</span>
              </label>
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
                className="select select-bordered h-auto"
                required
              >
                <option value="new-members">New Members</option>
                <option value="renewals">Renewals</option>
                <option value="special-offers">Special Offers</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Reusable</span>
              </label>
              <input
                type="checkbox"
                name="reusable"
                checked={formData.reusable}
                onChange={handleInputChange}
                className="toggle"
              />
            </div>
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea textarea-bordered h-24"
              required
            />
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponFormModal;