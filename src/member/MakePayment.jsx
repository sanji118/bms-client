import { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { formatCurrency, getCurrentMonth } from '../utils';

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

  // Mock apartment data - in a real app, this would come from the API
  const apartment = {
    floor: '3',
    block: 'B',
    roomNo: '302',
    rent: 1200
  };

  const handleApplyCoupon = async () => {
    if (!formData.couponCode) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      setLoading(true);
      const coupon = await getCouponByCode(formData.couponCode);
      
      if (!coupon || !coupon.isActive) {
        throw new Error('Invalid or inactive coupon');
      }

      setDiscount(coupon.discountPercentage);
      setCouponApplied(true);
      setError('');
    } catch (err) {
      setError(err.message);
      setDiscount(0);
      setCouponApplied(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        month: formData.month,
        couponCode: formData.couponCode || undefined,
        amount: apartment.rent * (1 - discount / 100)
      };

      await processPayment(paymentData);
      setSuccess('Payment processed successfully!');
      setFormData({
        month: getCurrentMonth(),
        couponCode: '',
      });
      setCouponApplied(false);
      setDiscount(0);
    } catch (err) {
      setError(err.message || 'Failed to process payment');
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

  const discountedAmount = apartment.rent * (1 - discount / 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Make Payment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-gray-700">Member Email</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              readOnly 
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-700">Floor</label>
            <input 
              type="text" 
              value={apartment.floor} 
              readOnly 
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-700">Block Name</label>
            <input 
              type="text" 
              value={apartment.block} 
              readOnly 
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-700">Apartment No</label>
            <input 
              type="text" 
              value={apartment.roomNo} 
              readOnly 
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-700">Rent</label>
            <input 
              type="text" 
              value={formatCurrency(apartment.rent)} 
              readOnly 
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-700">Month</label>
            <input 
              type="month" 
              name="month"
              value={formData.month} 
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <label className="block text-gray-700">Coupon Code</label>
            <input 
              type="text" 
              name="couponCode"
              value={formData.couponCode} 
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled={couponApplied}
            />
          </div>
          
          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={couponApplied || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Apply Coupon'}
          </button>
        </div>
        
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        
        {couponApplied && (
          <div className="p-4 bg-green-50 rounded">
            <p>Coupon applied! You get {discount}% discount.</p>
            <p className="font-semibold">
              New amount to pay: {formatCurrency(discountedAmount)}
            </p>
          </div>
        )}
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Processing Payment...' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MakePayment;