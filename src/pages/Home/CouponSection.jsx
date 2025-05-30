import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCoupons } from '../../utils/useCoupon';
import CouponCard from '../../coupons/CouponCard';

const CouponSection = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getCoupons();
        setCoupons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleViewAll = () => navigate('/coupons');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const displayedCoupons = coupons.slice(0, 4);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader />
        
        {displayedCoupons.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {displayedCoupons.map((coupon, index) => (
              <CouponCard key={coupon._id} coupon={coupon} index={index} />
            ))}
          </motion.div>
        )}

        {coupons.length > 4 && <ViewAllButton count={coupons.length} onClick={handleViewAll} />}
      </div>
    </section>
  );
};

const SectionHeader = () => (
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
);

const LoadingState = () => (
  <div className="max-w-6xl mx-auto text-center">
    <motion.div
      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      className="rounded-full h-16 w-16 border-4 border-t-yellow-500 border-r-pink-500 border-b-green-500 border-l-blue-500 mx-auto"
    />
    <motion.p 
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
      className="mt-6 text-xl font-medium text-gray-600"
    >
      Loading amazing deals...
    </motion.p>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="max-w-6xl mx-auto text-center">
    <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-600 font-medium">Error loading coupons: {error}</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="inline-block p-6 bg-white rounded-xl shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
      <p className="mt-4 text-lg text-gray-600">No coupons available at the moment</p>
    </div>
  </div>
);

const ViewAllButton = ({ count, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="text-center mt-16"
  >
    <button 
      onClick={onClick}
      className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center mx-auto group"
    >
      <span className="mr-2 font-medium">View All Coupons</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
    <p className="mt-4 text-gray-500 text-sm">Showing 4 of {count} available coupons</p>
  </motion.div>
);

export default CouponSection;