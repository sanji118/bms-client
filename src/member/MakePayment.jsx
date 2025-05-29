import { useState, useEffect } from 'react';
import { useAuth } from '../hook/useAuth';
import { formatCurrency, getCurrentMonth, getAgreements, getCouponById, getCoupons } from '../utils';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
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
  FaCreditCard,
  FaCheckCircle
} from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { MdDiscount, MdOutlineApartment } from 'react-icons/md';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ 
  apartment, 
  formData, 
  setFormData, // Add this
  couponApplied, 
  setCouponApplied, // Add this
  discount, // Add this
  setDiscount, // Add this
  discountAmount, 
  setDiscountAmount, // Add this
  loading,
  setLoading, // Add this
  paymentCompleted,
  handleChange,
  handleApplyCoupon,
  handleRemoveCoupon,
  error,
  setError,
  success,
  setSuccess,
  user,
  setPaymentCompleted
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const finalAmount = apartment.rent - discountAmount;

  const processStripePayment = async (paymentData) => {
    try {
      
      const response = await axios.post('/api/payments/create-intent', {
        amount: finalAmount * 100, 
        currency: 'usd',
        metadata: {
          memberEmail: user.email,
          month: formData.month,
          apartmentNo: apartment.roomNo,
          agreementId: apartment.agreementId
        }
      });

      const { clientSecret } = response.data;

      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: user.email,
            name: user.name || 'Rent Payment User'
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        return {
          transactionId: paymentIntent.id,
          paymentMethod: 'card'
        };
      }
    } catch (err) {
      console.error('Payment error:', err);
      throw err;
    }
  };

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const paymentData = {
        memberEmail: user.email,
        memberId: user.id,
        floor: apartment.floor,
        block: apartment.block,
        apartmentNo: apartment.roomNo,
        rent: apartment.rent,
        month: formData.month,
        couponCode: couponApplied ? formData.couponCode : null,
        discountAmount: discountAmount,
        amount: finalAmount,
        agreementId: apartment.agreementId,
      };

      
      const paymentResult = await processStripePayment(paymentData);
      
      // Save payment to database
      const savedPayment = await axios.post('/api/payments', {
        ...paymentData,
        transactionId: paymentResult.transactionId,
        paymentMethod: paymentResult.paymentMethod,
        status: 'completed'
      });

      setSuccess('Payment processed successfully!');
      setPaymentCompleted(true);
      localStorage.setItem('paymentCompleted', JSON.stringify(true));
      localStorage.setItem('lastPaymentMonth', formData.month);
      
      // Reset form
      setFormData({
        month: getCurrentMonth(),
        couponCode: '',
      });
      setCouponApplied(false);
      setDiscount(0);
      setDiscountAmount(0);

      // Show success message
      Swal.fire({
        title: 'Payment Successful!',
        html: `
          <div class="text-left space-y-2">
            <p class="flex items-center gap-2"><strong>Amount Paid:</strong> ${formatCurrency(finalAmount)}</p>
            ${couponApplied ? `
              <p class="flex items-center gap-2"><strong>Discount Applied:</strong> 
                ${discount > 0 ? `${discount}%` : formatCurrency(discountAmount)} 
                (${formatCurrency(discountAmount)})
              </p>
            ` : ''}
            <p class="flex items-center gap-2"><strong>Original Rent:</strong> ${formatCurrency(apartment.rent)}</p>
            <p class="flex items-center gap-2"><strong>For Month:</strong> ${new Date(paymentData.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            <p class="flex items-center gap-2"><strong>Transaction ID:</strong> ${paymentResult.transactionId}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#10B981',
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to process payment');
      Swal.fire({
        title: 'Payment Failed',
        text: err.response?.data?.message || err.message || 'There was an error processing your payment',
        icon: 'error',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleStripeSubmit} className="space-y-6">
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
            value={apartment.floor} 
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
            value={apartment.block} 
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
            value={apartment.roomNo} 
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
            value={formatCurrency(apartment.rent)} 
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
                disabled={couponApplied || loading || paymentCompleted}
                placeholder="Enter coupon code"
              />
              <MdDiscount className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>
          
          {couponApplied ? (
            <button
              type="button"
              onClick={handleRemoveCoupon}
              disabled={loading || paymentCompleted}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-colors flex items-center gap-2"
            >
              <FaTimes /> Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponApplied || loading || !formData.couponCode || paymentCompleted}
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
                  <p className="text-sm text-blue-600">
                    {discount > 0 ? `${discount}% discount` : `${formatCurrency(discountAmount)} off`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 line-through">{formatCurrency(apartment.rent)}</p>
                <p className="text-xl font-bold text-blue-800">{formatCurrency(finalAmount)}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-blue-700 flex items-center gap-1">
              <FaMoneyBillWave /> You saved {formatCurrency(discountAmount)}!
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Stripe Card Element */}
      {!paymentCompleted && (
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Card Details</label>
          <div className="p-3 border border-gray-300 rounded-lg bg-white">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!stripe || loading || paymentCompleted}
          className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-3 ${
            paymentCompleted
              ? 'bg-gray-400 cursor-not-allowed' 
              : loading 
                ? 'bg-green-600' 
                : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Processing Payment...
            </>
          ) : paymentCompleted ? (
            <>
              <FaCheckCircle className="text-lg" />
              Payment Complete
            </>
          ) : (
            <>
              <FaCreditCard className="text-lg" />
              Pay Now {formatCurrency(finalAmount)}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const MakePayment = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    month: getCurrentMonth(),
    couponCode: '',
  });
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apartment, setApartment] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(
    () => JSON.parse(localStorage.getItem('paymentCompleted')) || false
  );
  const [transactionId, setTransactionId] = useState('');

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

  useEffect(() => {
    const lastPaymentMonth = localStorage.getItem('lastPaymentMonth');
    if (lastPaymentMonth !== formData.month) {
      localStorage.removeItem('paymentCompleted');
      localStorage.removeItem('lastPaymentMonth');
      setPaymentCompleted(false);
    }
  }, [formData.month]);

  const generateTransactionId = () => {
    return 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  const handleApplyCoupon = async () => {
    if (!formData.couponCode) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const allCoupons = await getCoupons();
      const coupon = allCoupons.find(c => c.code === formData.couponCode);
      
      if (!coupon) {
        throw new Error('Coupon not found');
      }

      const fullCoupon = await getCouponById(coupon._id);
      
      if (!fullCoupon || fullCoupon.status !== 'active') {
        throw new Error('Invalid or inactive coupon');
      }

      const currentDate = new Date();
      if (fullCoupon.validFrom && new Date(fullCoupon.validFrom) > currentDate) {
        throw new Error('This coupon is not yet valid');
      }

      if (fullCoupon.validUntil && new Date(fullCoupon.validUntil) < currentDate) {
        throw new Error('This coupon has expired');
      }

      if (fullCoupon.minRent && apartment.rent < fullCoupon.minRent) {
        throw new Error(`Minimum rent of ${formatCurrency(fullCoupon.minRent)} required for this coupon`);
      }

      if (fullCoupon.applicableFor && !fullCoupon.applicableFor.includes('existing-members')) {
        throw new Error('This coupon is not applicable for your account');
      }

      let calculatedDiscount = 0;
      let calculatedDiscountAmount = 0;
      
      if (fullCoupon.type === 'percentage') {
        calculatedDiscount = fullCoupon.discount;
        calculatedDiscountAmount = apartment.rent * (fullCoupon.discount / 100);
      } else if (fullCoupon.type === 'fixed') {
        calculatedDiscountAmount = fullCoupon.discount;
        calculatedDiscount = (calculatedDiscountAmount / apartment.rent) * 100;
      }

      setDiscount(calculatedDiscount);
      setDiscountAmount(calculatedDiscountAmount);
      setCouponApplied(true);
      
      Swal.fire({
        title: 'Coupon Applied!',
        html: `
          <div class="text-left">
            <p><strong>Code:</strong> ${fullCoupon.code}</p>
            <p><strong>Discount:</strong> ${fullCoupon.type === 'percentage' 
              ? `${fullCoupon.discount}%` 
              : formatCurrency(fullCoupon.discount)}</p>
            <p><strong>Description:</strong> ${fullCoupon.description}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#10B981',
      });
    } catch (err) {
      setError(err.message);
      setDiscount(0);
      setDiscountAmount(0);
      setCouponApplied(false);
    } finally {
      setLoading(false);
    }
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
      
      <Elements stripe={stripePromise}>
        <CheckoutForm 
          apartment={apartment}
          formData={formData}
          couponApplied={couponApplied}
          discountAmount={discountAmount}
          loading={loading}
          paymentCompleted={paymentCompleted}
          handleChange={handleChange}
          handleApplyCoupon={handleApplyCoupon}
          handleRemoveCoupon={handleRemoveCoupon}
          error={error}
          success={success}
          user={user}
          setError={setError}
          setSuccess={setSuccess}
          setPaymentCompleted={setPaymentCompleted}
        />
      </Elements>
    </motion.div>
  );
};

export default MakePayment;