import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hook/useAuth';
import { formatCurrency, getCurrentMonth } from '../utils';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaTag, 
  FaTimes, 
  FaCheck, 
  FaExclamationTriangle,
  FaSpinner,
  FaBuilding,
  FaLayerGroup,
  FaEnvelope,
  FaCreditCard,
  FaCheckCircle
} from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { MdDiscount, MdOutlineApartment } from 'react-icons/md';
import axiosInstance from '../utils/axiosInstance';

const MakePayment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    month: getCurrentMonth(),
    couponCode: '',
  });
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
  const { data: agreements, isLoading: agreementsLoading } = useQuery({
    queryKey: ['userAgreements', user.email],
    queryFn: async () => {
      const response = await axiosInstance.get(`/agreements/user/${user.email}`);
      return response.data;
    },
    enabled: !!user.email,
  });

  
  const activeAgreement = agreements?.find(agreement => agreement.status === 'accepted');

  
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['userPayments', user.email, formData.month],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/payments/user/${user.email}?month=${formData.month}`
      );
      return response.data;
    },
    enabled: !!user.email && !!formData.month,
  });

 
  const paymentCompleted = payments?.some(
    payment => payment.status === 'completed' && payment.month === formData.month
  );

  
  const applyCouponMutation = useMutation({
    mutationFn: async (couponCode) => {
      const response = await axiosInstance.post('/coupons/apply', { code: couponCode });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.valid) {
        let calculatedDiscount = 0;
        let calculatedDiscountAmount = 0;
        
        if (data.type === 'percentage') {
          calculatedDiscount = data.discount;
          calculatedDiscountAmount = activeAgreement.rent * (data.discount / 100);
        } else if (data.type === 'fixed') {
          calculatedDiscountAmount = data.discount;
          calculatedDiscount = (calculatedDiscountAmount / activeAgreement.rent) * 100;
        }

        setDiscount(calculatedDiscount);
        setDiscountAmount(calculatedDiscountAmount);
        setCouponApplied(true);
        
        Swal.fire({
          title: 'Coupon Applied!',
          html: `
            <div class="text-left">
              <p><strong>Discount:</strong> ${data.type === 'percentage' 
                ? `${data.discount}%` 
                : formatCurrency(data.discount)}</p>
              <p><strong>Description:</strong> ${data.message}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#10B981',
        });
      }
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to apply coupon');
      setDiscount(0);
      setDiscountAmount(0);
      setCouponApplied(false);
    }
  });

  
  const submitPaymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      const response = await axiosInstance.post('/payments/request', paymentData);
      return response.data;
    },
    onSuccess: (data) => {
      setSuccess('Payment request submitted successfully!');
      queryClient.invalidateQueries(['userPayments', user.email, formData.month]);
      
      Swal.fire({
        title: 'Payment Request Submitted!',
        html: `
          <div class="text-left space-y-2">
            <p class="flex items-center gap-2"><strong>Amount to Pay:</strong> ${formatCurrency(data.amount)}</p>
            ${couponApplied ? `
              <p class="flex items-center gap-2"><strong>Discount Applied:</strong> 
                ${discount > 0 ? `${discount}%` : formatCurrency(discountAmount)} 
                (${formatCurrency(discountAmount)})
              </p>
            ` : ''}
            <p class="flex items-center gap-2"><strong>For Month:</strong> ${new Date(data.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            <p class="flex items-center gap-2"><strong>Reference ID:</strong> ${data.transactionId}</p>
            <p class="text-yellow-600">Please complete payment to the building management and show this reference.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#10B981',
      });

      
      setFormData({
        month: getCurrentMonth(),
        couponCode: '',
      });
      setCouponApplied(false);
      setDiscount(0);
      setDiscountAmount(0);
    },
    onError: (error) => {
      setError(error.response?.data?.message || error.message || 'Failed to submit payment request');
      Swal.fire({
        title: 'Payment Failed',
        text: error.response?.data?.message || error.message || 'There was an error processing your payment request',
        icon: 'error',
        confirmButtonColor: '#EF4444',
      });
    }
  });

  const handleApplyCoupon = () => {
    if (!formData.couponCode) {
      setError('Please enter a coupon code');
      return;
    }
    applyCouponMutation.mutate(formData.couponCode);
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setDiscountAmount(0);
    setCouponApplied(false);
    setFormData(prev => ({ ...prev, couponCode: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activeAgreement) {
      setError('Apartment information not loaded');
      return;
    }

    if (paymentCompleted) {
      setError('Payment for this month is already completed');
      return;
    }

    setError('');
    setSuccess('');

    const finalAmount = activeAgreement.rent - discountAmount;
    const transactionId = `TXN-${Date.now().toString(36).toUpperCase()}`;

    const paymentData = {
      memberEmail: user.email,
      memberId: user.id,
      floor: activeAgreement.floor,
      block: activeAgreement.block,
      apartmentNo: activeAgreement.apartmentNo,
      rent: activeAgreement.rent,
      month: formData.month,
      couponCode: couponApplied ? formData.couponCode : null,
      discountAmount: discountAmount,
      amount: finalAmount,
      agreementId: activeAgreement._id,
      transactionId: transactionId,
      paymentMethod: 'manual',
      status: 'pending'
    };

    submitPaymentMutation.mutate(paymentData);
  };

  if (agreementsLoading || paymentsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <p className="text-gray-600">Loading your rental information...</p>
      </div>
    );
  }

  if (!activeAgreement) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <FaExclamationTriangle className="text-4xl text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-800">No Active Rental Agreement</h2>
          <p className="text-gray-600 text-center">
            You don't have any active rental agreement. Please contact support if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  const finalAmount = activeAgreement.rent - discountAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <GiPayMoney className="text-3xl text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Make Payment</h2>
      </div>
      
      {paymentCompleted && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
          <div className="flex items-center gap-2 text-green-800">
            <FaCheckCircle />
            <span>Payment for {new Date(formData.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} has been completed</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Email */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium flex items-center gap-2">
              <FaEnvelope /> Member Email
            </label>
            <input 
              type="email" 
              value={user?.email || ''} 
              readOnly 
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          {/* Floor */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium flex items-center gap-2">
              <FaLayerGroup /> Floor
            </label>
            <input 
              type="text" 
              value={activeAgreement.floor} 
              readOnly 
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          {/* Block Name */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium flex items-center gap-2">
              <FaBuilding /> Block Name
            </label>
            <input 
              type="text" 
              value={activeAgreement.block} 
              readOnly 
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          {/* Apartment No */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium items-center gap-2">
              <MdOutlineApartment /> Apartment No
            </label>
            <input 
              type="text" 
              value={activeAgreement.apartmentNo} 
              readOnly 
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          {/* Rent Amount */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium items-center gap-2">
              <FaMoneyBillWave /> Rent Amount
            </label>
            <input 
              type="text" 
              value={formatCurrency(activeAgreement.rent)} 
              readOnly 
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          {/* Month */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium items-center gap-2">
              <FaCalendarAlt /> Month
            </label>
            <input 
              type="month" 
              name="month"
              value={formData.month} 
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min={getCurrentMonth()}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Coupon Code Section */}
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <label className="block text-gray-700 font-medium items-center gap-2">
                <FaTag /> Coupon Code
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="couponCode"
                  value={formData.couponCode} 
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                  disabled={couponApplied || paymentCompleted}
                  placeholder="Enter coupon code"
                />
                <MdDiscount className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              </div>
            </div>
            
            {couponApplied ? (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                disabled={paymentCompleted}
                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                <FaTimes /> Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={!formData.couponCode || paymentCompleted || applyCouponMutation.isPending}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                {applyCouponMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaCheck />} 
                {applyCouponMutation.isPending ? 'Verifying...' : 'Apply Coupon'}
              </button>
            )}
          </div>
          
          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2"
            >
              <FaExclamationTriangle />
              <span>{error}</span>
            </motion.div>
          )}
          
          {/* Success Message */}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2"
            >
              <FaCheck />
              <span>{success}</span>
            </motion.div>
          )}
          
          {/* Coupon Applied Message */}
          {couponApplied && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-blue-50 rounded-lg border border-blue-100"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MdDiscount className="text-blue-600 text-xl" />
                  <div>
                    <p className="font-medium text-blue-800">Coupon applied successfully!</p>
                    <p className="text-sm text-blue-600">
                      {discount > 0 ? `${discount}% discount` : `${formatCurrency(discountAmount)} off`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 line-through">{formatCurrency(activeAgreement.rent)}</p>
                  <p className="text-xl font-bold text-blue-800">{formatCurrency(finalAmount)}</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-blue-700 flex items-center gap-1">
                <FaMoneyBillWave /> You saved {formatCurrency(discountAmount)}!
              </div>
            </motion.div>
          )}
        </div>

        {/* Payment Instructions */}
        {!paymentCompleted && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-bold text-yellow-800 mb-2">Payment Instructions</h3>
            <p className="text-yellow-700">
              After submitting this form, please make your payment to the building management office.
              Bring your reference ID for verification.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={paymentCompleted || submitPaymentMutation.isPending}
            className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-3 ${
              paymentCompleted
                ? 'bg-gray-400 cursor-not-allowed' 
                : submitPaymentMutation.isPending
                  ? 'bg-green-600' 
                  : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {submitPaymentMutation.isPending ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing Request...
              </>
            ) : paymentCompleted ? (
              <>
                <FaCheckCircle className="text-lg" />
                Payment Already Completed
              </>
            ) : (
              <>
                <FaCreditCard className="text-lg" />
                Submit Payment Request {formatCurrency(finalAmount)}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default MakePayment;