import React, { useState, useEffect } from 'react';
import { getCoupons, createCoupon, updateCouponStatus, deleteCoupon } from '../utils';
import { FiPlus, FiTrash2, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import { FaPercentage, FaDollarSign } from 'react-icons/fa';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    discount: 10,
    validity: [new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1))],
    minRent: 0,
    applicableFor: [],
    description: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const couponData = {
        ...formData,
        validFrom: formData.validity[0].toISOString().split('T')[0],
        validUntil: formData.validity[1].toISOString().split('T')[0],
        status: 'active'
      };
      
      setLoading(true);
      await createCoupon(couponData);
      Swal.fire('Success', 'Coupon created successfully', 'success');
      setIsModalOpen(false);
      fetchCoupons();
    } catch (error) {
      Swal.fire('Error', 'Failed to create coupon', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateCouponStatus(id, status ? 'active' : 'inactive');
      Swal.fire('Success', 'Coupon status updated', 'success');
      fetchCoupons();
    } catch (error) {
      Swal.fire('Error', 'Failed to update coupon status', 'error');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCoupon(id);
          Swal.fire('Deleted!', 'Coupon has been deleted.', 'success');
          fetchCoupons();
        } catch (error) {
          Swal.fire('Error', 'Failed to delete coupon', 'error');
        }
      }
    });
  };

  return (
    <div className="p-6 bg-white border-l border-l-cyan-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-cyan-500">Manage Coupons</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn bg-cyan-600"
        >
          <FiPlus className="mr-2" /> Add Coupon
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full bg-cyan-50">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Type</th>
              <th>Validity</th>
              <th>Min Rent</th>
              <th>Applicable For</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon._id}>
                <td>{coupon.code}</td>
                <td>
                  {coupon.type === 'percentage' ? (
                    <span className="flex items-center">
                      <FaPercentage className="mr-1" /> {coupon.discount}%
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaDollarSign className="mr-1" /> {coupon.discount}
                    </span>
                  )}
                </td>
                <td>
                  <span className={`badge ${coupon.type === 'percentage' ? 'badge-primary' : 'badge-secondary'}`}>
                    {coupon.type.toUpperCase()}
                  </span>
                </td>
                <td>{coupon.validFrom} to {coupon.validUntil}</td>
                <td>{coupon.minRent ? `$${coupon.minRent}` : 'None'}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {coupon.applicableFor?.map(tag => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-success"
                    checked={coupon.status === 'active'}
                    onChange={(e) => handleStatusChange(coupon._id, e.target.checked)}
                  />
                </td>
                <td>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    <FiTrash2 className='text-xl text-red-600' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
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
                    placeholder="WELCOME10"
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
                    onChange={(dates) => setFormData({...formData, validity: dates})}
                    startDate={formData.validity[0]}
                    endDate={formData.validity[1]}
                    selectsRange
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Minimum Rent Amount</span>
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-3" />
                    <input
                      type="number"
                      name="minRent"
                      value={formData.minRent}
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
                    onChange={(e) => setFormData({
                      ...formData,
                      applicableFor: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                    className="select select-bordered h-auto"
                    required
                  >
                    <option value="new-members">New Members</option>
                    <option value="renewals">Renewals</option>
                    <option value="special-offers">Special Offers</option>
                  </select>
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
      )}
    </div>
  );
};

export default ManageCoupons;