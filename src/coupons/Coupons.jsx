import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCoupons } from '../utils/useCoupon';
import CouponCard from './CouponCard';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-yellow-200 to-yellow-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-pink-500">
            All Available Coupons
          </h1>
          <p className="text-xl text-gray-600">
            Browse through all our exclusive offers
          </p>
        </motion.div>

        {coupons.length === 0 ? (
          <EmptyState />
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {coupons.map((coupon, index) => (
              <CouponCard key={coupon._id} coupon={coupon} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};


const LoadingState = () => (
  <div className="max-w-6xl mx-auto text-center py-20">
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
      Loading all coupons...
    </motion.p>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="max-w-6xl mx-auto text-center py-20">
    <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-600 font-medium">Error loading coupons: {error}</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20">
    <div className="inline-block p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
      <p className="mt-4 text-lg text-gray-600">No coupons available at the moment</p>
      <p className="text-sm text-gray-500 mt-2">Check back later for exciting offers!</p>
    </div>
  </div>
);

export default Coupons;