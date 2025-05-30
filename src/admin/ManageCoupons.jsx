import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';
import CouponsTable from '../coupons/CouponsTable';
import CouponFormModal from '../coupons/CouponFormModal';
import {
  getCoupons,
  createCoupon,
  updateCouponStatus,
  deleteCoupon
} from '../utils/useCoupon';

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    discount: 10,
    validity: [new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1))],
    minAmount: 0,
    applicableFor: [],
    description: '',
    reusable: true
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const couponData = {
        ...formData,
        validFrom: formData.validity[0].toISOString(),
        expiryDate: formData.validity[1].toISOString(),
        status: 'active',
        minAmount: formData.minAmount || 0,
        createdAt: new Date().toISOString(),
        createdBy: 'admin@example.com'
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
      text: "This action cannot be undone!",
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
          className="btn bg-cyan-600 text-white"
        >
          <FiPlus className="mr-2" /> Add Coupon
        </button>
      </div>

      <CouponsTable 
        coupons={coupons} 
        handleStatusChange={handleStatusChange} 
        handleDelete={handleDelete} 
      />

      <CouponFormModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default ManageCoupons;