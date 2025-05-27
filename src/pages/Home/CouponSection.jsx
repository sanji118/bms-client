import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const COLOR_PALETTE = [
  { 
    name: 'yellow',
    border: 'border-yellow-300',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    button: 'bg-yellow-600 hover:bg-yellow-700'
  },
  { 
    name: 'pink',
    border: 'border-pink-300',
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    button: 'bg-pink-600 hover:bg-pink-700'
  },
  { 
    name: 'green',
    border: 'border-green-300',
    bg: 'bg-green-100',
    text: 'text-green-800',
    button: 'bg-green-600 hover:bg-green-700'
  }
];

const CouponSection = () => {
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('http://localhost:5000/coupons');
        setCoupons(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching coupons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const flipVariants = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 }
  };

  const getColorClasses = (index) => {
    return COLOR_PALETTE[index % COLOR_PALETTE.length] || COLOR_PALETTE[0];
  };

  const showSuccessAlert = (code) => {
    MySwal.fire({
      title: <p className="text-xl font-bold">Copied!</p>,
      html: <p>Coupon code <strong>{code}</strong> has been copied to your clipboard</p>,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d97706',
      timer: 2000,
      timerProgressBar: true,
    });
  };

  if (loading) {
    return (
      <section className="py-12 px-4 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading coupons...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500">Error loading coupons: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-indigo-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2 text-yellow-600">Special Offers</h2>
        <p className="text-lg text-center text-gray-600 mb-12">Exclusive discounts for our valued residents</p>

        {coupons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">No coupons available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coupons.map((coupon, index) => {
              const color = getColorClasses(index);
              
              return (
                <motion.div
                  key={coupon.id || index}
                  className="relative cursor-pointer h-full min-h-[300px]"
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveCoupon(activeCoupon === coupon.id ? null : coupon.id)}
                >
                  {/* Coupon Front */}
                  <motion.div
                    initial="visible"
                    animate={activeCoupon === coupon.id ? "hidden" : "visible"}
                    variants={flipVariants}
                    className={`absolute inset-0 bg-white rounded-xl shadow-lg p-6 ${color.border} flex flex-col h-full`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${color.bg} ${color.text}`}>
                        LIMITED TIME
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Expires</p>
                        <p className="font-semibold">
                          {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center my-4">
                      <p className="text-sm text-gray-600">{coupon.description || 'Special discount'}</p>
                      <h3 className={`text-4xl font-bold my-3 ${color.text}`}>
                        {coupon.type === 'percentage' ? 
                          `${coupon.discount}% OFF` : 
                          `$${coupon.discount} OFF`}
                      </h3>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-mono font-bold">{coupon.code}</span>
                        <button className={`text-xs text-white px-3 py-1 rounded transition ${color.button}`}>
                          Tap to view
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Coupon Back */}
                  <motion.div
                    initial="hidden"
                    animate={activeCoupon === coupon.id ? "visible" : "hidden"}
                    variants={flipVariants}
                    className={`bg-white rounded-xl shadow-lg p-6 ${color.border} h-full flex flex-col`}
                  >
                    <div className="text-center mb-4">
                      <h3 className={`text-2xl font-bold ${color.text}`}>
                        {coupon.type === 'percentage' ? 
                          `${coupon.discount}% OFF` : 
                          `$${coupon.discount} OFF`}
                      </h3>
                      <p className="font-mono font-bold text-lg my-2">{coupon.code}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-700 mb-2">{coupon.description || 'Special discount'}</p>
                      <p className="text-sm text-gray-500">
                        <strong>Valid until:</strong> {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'N/A'}
                      </p>
                      {coupon.terms && (
                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Terms:</strong> {coupon.terms}
                        </p>
                      )}
                    </div>
                    
                    <CopyToClipboard 
                      text={coupon.code}
                      onCopy={() => showSuccessAlert(coupon.code)}
                    >
                      <button 
                        className={`mt-auto text-white py-2 px-4 rounded-lg transition w-full ${color.button}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Copy Code
                      </button>
                    </CopyToClipboard>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition shadow-lg flex items-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
            </svg>
            View All Coupons
          </button>
        </div>
      </div>
    </section>
  );
};

export default CouponSection;