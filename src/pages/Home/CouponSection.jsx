import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCoupons } from '../../utils';
import copy from 'copy-to-clipboard';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const COLOR_PALETTE = [
  { 
    name: 'yellow',
    border: 'border-yellow-300',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    button: 'bg-yellow-600 hover:bg-yellow-700',
    gradient: 'from-yellow-100 to-yellow-50'
  },
  { 
    name: 'pink',
    border: 'border-pink-300',
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    button: 'bg-pink-600 hover:bg-pink-700',
    gradient: 'from-pink-100 to-pink-50'
  },
  { 
    name: 'green',
    border: 'border-green-300',
    bg: 'bg-green-100',
    text: 'text-green-800',
    button: 'bg-green-600 hover:bg-green-700',
    gradient: 'from-green-100 to-green-50'
  },
  { 
    name: 'blue',
    border: 'border-blue-300',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    button: 'bg-blue-600 hover:bg-blue-700',
    gradient: 'from-blue-100 to-blue-50'
  }
];

const CouponSection = () => {
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        // Using the imported getCoupons function
        const data = await getCoupons();
        setCoupons(data);
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
    visible: { 
      rotateY: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    },
    exit: { 
      rotateY: -90, 
      opacity: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
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

  const handleViewAll = () => {
    navigate('/coupons');
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "linear"
            }}
            className="rounded-full h-16 w-16 border-4 border-t-yellow-500 border-r-pink-500 border-b-green-500 border-l-blue-500 mx-auto"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
            className="mt-6 text-xl font-medium text-gray-600"
          >
            Loading amazing deals...
          </motion.p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 font-medium">Error loading coupons: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  const displayedCoupons = coupons.slice(0, 4);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-pink-500">
            Exclusive Offers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock special discounts crafted just for our valued residents
          </p>
        </motion.div>

        {displayedCoupons.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-white rounded-xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              <p className="mt-4 text-lg text-gray-600">No coupons available at the moment</p>
              <p className="text-sm text-gray-500 mt-2">Check back later for exciting offers!</p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {displayedCoupons.map((coupon, index) => {
              const color = getColorClasses(index);
              
              return (
                <motion.div
                  key={coupon._id || index}
                  className="relative cursor-pointer h-full min-h-[300px] perspective-1000"
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveCoupon(activeCoupon === coupon._id ? null : coupon._id)}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        type: 'spring',
                        stiffness: 100
                      }
                    }
                  }}
                >
                  {/* Coupon Front */}
                  <motion.div
                    initial="visible"
                    animate={activeCoupon === coupon._id ? "hidden" : "visible"}
                    variants={flipVariants}
                    className={`absolute inset-0 bg-white rounded-xl shadow-lg p-6 ${color.border} border-2 flex flex-col h-full backface-hidden`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="absolute top-4 right-4">
                      <div className={`w-12 h-12 rounded-full ${color.bg} opacity-20`}></div>
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${color.bg} ${color.text}`}>
                        {coupon.isNew ? 'NEW OFFER' : 'LIMITED TIME'}
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Expires</p>
                        <p className="font-semibold">
                          {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center my-4 flex-grow flex flex-col justify-center">
                      <p className="text-sm text-gray-600 mb-2">{coupon.description || 'Special discount'}</p>
                      <h3 className={`text-5xl font-bold my-3 ${color.text}`}>
                        {coupon.discountType === 'percentage' ? 
                          `${coupon.discountValue}% OFF` : 
                          `$${coupon.discountValue} OFF`}
                      </h3>
                      <div className="mt-4">
                        <div className={`h-1 ${color.bg} rounded-full mx-auto w-3/4`}></div>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="font-mono font-bold text-gray-700">{coupon.code}</span>
                        <button className={`text-xs text-white px-3 py-1 rounded-full transition ${color.button} shadow-md`}>
                          Tap to view
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Coupon Back */}
                  <motion.div
                    initial="hidden"
                    animate={activeCoupon === coupon._id ? "visible" : "hidden"}
                    variants={flipVariants}
                    className={`bg-white rounded-xl shadow-lg p-6 ${color.border} border-2 h-full flex flex-col backface-hidden`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                    
                    <div className="text-center mb-4">
                      <h3 className={`text-3xl font-bold ${color.text}`}>
                        {coupon.discountType === 'percentage' ? 
                          `${coupon.discountValue}% OFF` : 
                          `$${coupon.discountValue} OFF`}
                      </h3>
                      <div className="my-4">
                        <div className={`inline-block px-4 py-2 rounded-lg ${color.bg} ${color.text} font-mono text-lg font-bold`}>
                          {coupon.code}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4 flex-grow">
                      <p className="text-gray-700 mb-3 text-center">{coupon.description || 'Special discount'}</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-600">
                            <strong>Valid until:</strong> {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        {coupon.terms && (
                          <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-600">
                              <strong>Terms:</strong> {coupon.terms}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      className={`mt-auto text-white py-3 px-4 rounded-lg transition w-full ${color.button} shadow-md flex items-center justify-center`}
                      onClick={(e) => {
                        e.stopPropagation();
                        copy(coupon.code);
                        showSuccessAlert(coupon.code);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Copy Code
                    </button>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {coupons.length > 4 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-16"
          >
            <button 
              onClick={handleViewAll}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center mx-auto group"
            >
              <span className="mr-2 font-medium">View All Coupons</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <p className="mt-4 text-gray-500 text-sm">Showing 4 of {coupons.length} available coupons</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CouponSection;