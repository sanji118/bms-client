import { useState, useEffect } from "react";
import { useAuth } from "../hook/useAuth";
import axios from "axios";


const MakePayment = () => {
  const { user } = useAuth();
  const [agreement, setAgreement] = useState(null);
  const [month, setMonth] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/agreements?email=${user.email}`);
        if (response.data.length > 0) {
          setAgreement(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching agreement:', error);
      }
    };

    fetchAgreement();
  }, [user.email]);

  const handleApplyCoupon = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/coupons/${couponCode}`);
      if (response.data) {
        setDiscount(response.data.discountPercentage);
        setCouponSuccess(`Coupon applied! ${response.data.discountPercentage}% discount`);
        setCouponError("");
      } else {
        setCouponError("Invalid coupon code");
        setCouponSuccess("");
      }
    } catch (error) {
      setCouponError("Invalid coupon code");
      setCouponSuccess("");
    }
  };

  const calculateTotal = () => {
    if (!agreement) return 0;
    const rent = agreement.rent || 0;
    return rent - (rent * discount / 100);
  };

  const handlePayment = () => {
    
    console.log("Processing payment...");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Make Payment</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Member Email:</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Floor:</span>
            <span>{agreement?.floor || 'None'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Block Name:</span>
            <span>{agreement?.block || 'None'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Room No:</span>
            <span>{agreement?.roomNo || 'None'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Rent:</span>
            <span>${agreement?.rent || 0}</span>
          </div>
          
          <div className="pt-4">
            <label className="block mb-2 font-medium">Month:</label>
            <input
              type="month"
              className="w-full p-2 border rounded"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>
          
          <div className="pt-4">
            <label className="block mb-2 font-medium">Apply Coupon:</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-red-500 mt-2">{couponError}</p>}
            {couponSuccess && <p className="text-green-500 mt-2">{couponSuccess}</p>}
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex justify-between font-medium text-lg">
              <span>Total Payable:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="pt-6">
            <button
              onClick={handlePayment}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              disabled={!month}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;