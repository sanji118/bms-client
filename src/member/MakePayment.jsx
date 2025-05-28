import { useState, useEffect } from 'react';
import { useAuth } from '../hook/useAuth';
import { formatCurrency, getCurrentMonth, getCouponByCode, processPayment, getAgreements } from '../utils';
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
  FaHome,
  FaLayerGroup,
  FaEnvelope,
  FaCreditCard
} from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { MdDiscount, MdOutlineApartment } from 'react-icons/md';

const MakePayment = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    month: getCurrentMonth(),
    couponCode: '',
  });
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apartment, setApartment] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        setFetchingData(true);
        const response = await getAgreements(user.email);
        if (response && response.length > 0) {
          const activeAgreement = response.find(agreement => agreement.status === 'accepted');
          if (activeAgreement) {
            setApartment({
              floor: activeAgreement.floor,
              block: activeAgreement.block,
              roomNo: activeAgreement.apartmentNo,
              rent: activeAgreement.rent,
              agreementId: activeAgreement._id,
              startDate: activeAgreement.startDate,
              endDate: activeAgreement.endDate,
              requestedDate: activeAgreement.requestDate
            });
          } else {
            setError('No active rental agreement found');
          }
        } else {
          setError('No rental agreements found for your account');
        }
      } catch (err) {
        console.error('Error fetching agreement:', err);
        setError('Failed to load apartment information. Please try again later.');
      } finally {
        setFetchingData(false);
      }
    };

    fetchApartmentData();
  }, [user.email]);

  const handleApplyCoupon = async () => {
    if (!formData.couponCode) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const coupon = await getCouponByCode(formData.couponCode);
      
      if (!coupon || !coupon.isActive) {
        throw new Error('Invalid or inactive coupon');
      }

      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        throw new Error('This coupon has expired');
      }

      setDiscount(coupon.discountPercentage);
      setCouponApplied(true);
      
      Swal.fire({
        title: 'Coupon Applied!',
        text: `You've received ${coupon.discountPercentage}% discount`,
        icon: 'success',
        confirmButtonColor: '#10B981',
      });
    } catch (err) {
      setError(err.message);
      setDiscount(0);
      setCouponApplied(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponApplied(false);
    setFormData(prev => ({ ...prev, couponCode: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apartment) {
      setError('Apartment information not loaded');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const paymentData = {
        memberEmail: user.email,
        floor: apartment.floor,
        block: apartment.block,
        apartmentNo: apartment.roomNo,
        rent: apartment.rent,
        startDate: activeAgreement.startDate,
        endDate: activeAgreement.endDate,
        requestedDate: activeAgreement.requestDate,
        month: formData.month,
        couponCode: couponApplied ? formData.couponCode : undefined,
        discountAmount: apartment.rent * (discount / 100),
        amount: apartment.rent * (1 - discount / 100),
        agreementId: apartment.agreementId
      };

      const result = await processPayment(paymentData);
      
      setSuccess('Payment processed successfully!');
      setFormData({
        month: getCurrentMonth(),
        couponCode: '',
      });
      setCouponApplied(false);
      setDiscount(0);

      Swal.fire({
        title: 'Payment Successful!',
        html: `
          <div class="text-left space-y-2">
            <p class="flex items-center gap-2"><strong>Amount Paid:</strong> ${formatCurrency(paymentData.amount)}</p>
            ${couponApplied ? `<p class="flex items-center gap-2"><strong>Discount Applied:</strong> ${discount}% (${formatCurrency(paymentData.discountAmount)})</p>` : ''}
            <p class="flex items-center gap-2"><strong>For Month:</strong> ${new Date(paymentData.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            <p class="flex items-center gap-2"><strong>Transaction ID:</strong> ${result.transactionId || 'N/A'}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#10B981',
      });
    } catch (err) {
      setError(err.message || 'Failed to process payment');
      Swal.fire({
        title: 'Payment Failed',
        text: err.message || 'There was an error processing your payment',
        icon: 'error',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (fetchingData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <p className="text-gray-600">Loading your rental information...</p>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <FaExclamationTriangle className="text-4xl text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-800">No Active Rental Agreement</h2>
          <p className="text-gray-600 text-center">
            {error || 'You don\'t have any active rental agreement. Please contact support if you believe this is an error.'}
          </p>
        </div>
      </div>
    );
  }

  const discountedAmount = apartment.rent * (1 - discount / 100);
  const discountAmount = apartment.rent * (discount / 100);

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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Email */}
          <div className="space-y-2">
            <label className=" text-gray-700 font-medium flex items-center gap-2">
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
            <label className=" text-gray-700 font-medium flex items-center gap-2">
              <FaLayerGroup /> Floor
            </label>
            <input 
              type="text" 
              value={apartment.floor} 
              readOnly 
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          {/* Block Name */}
          <div className="space-y-2">
            <label className=" text-gray-700 font-medium flex items-center gap-2">
              <FaBuilding /> Block Name
            </label>
            <input 
              type="text" 
              value={apartment.block} 
              readOnly 
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          {/* Apartment No */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium  items-center gap-2">
              <MdOutlineApartment /> Apartment No
            </label>
            <input 
              type="text" 
              value={apartment.roomNo} 
              readOnly 
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          {/* Rent Amount */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium  items-center gap-2">
              <FaMoneyBillWave /> Rent Amount
            </label>
            <input 
              type="text" 
              value={formatCurrency(apartment.rent)} 
              readOnly 
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          {/* Month */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium  items-center gap-2">
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
                  disabled={couponApplied || loading}
                  placeholder="Enter coupon code"
                />
                <MdDiscount className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              </div>
            </div>
            
            {couponApplied ? (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                disabled={loading}
                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                <FaTimes /> Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponApplied || loading || !formData.couponCode}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaCheck />} 
                {loading ? 'Verifying...' : 'Apply Coupon'}
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
                    <p className="text-sm text-blue-600">{discount}% discount applied</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 line-through">{formatCurrency(apartment.rent)}</p>
                  <p className="text-xl font-bold text-blue-800">{formatCurrency(discountedAmount)}</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-blue-700 flex items-center gap-1">
                <FaMoneyBillWave /> You saved {formatCurrency(discountAmount)}!
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <FaCreditCard className="text-lg" />
                Pay Now {couponApplied ? formatCurrency(discountedAmount) : formatCurrency(apartment.rent)}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default MakePayment;