import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaHome, FaExclamationTriangle } from 'react-icons/fa';

const Unauthorized = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-amber-700 to-yellow-600 flex flex-col items-center justify-center p-6 text-white"
    >
      <motion.div
        initial={{ scale: 0.8, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1.1, 1]
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 2
            }}
            className="mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-70"></div>
              <FaLock className="relative text-6xl text-white" />
            </div>
          </motion.div>

          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-400" />
            Access Denied
            <FaExclamationTriangle className="text-yellow-400" />
          </h1>
          
          <p className="text-lg mb-6 text-white/90">
            You don't have permission to view this page. Please contact your administrator if you believe this is an error.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 bg-white text-yellow-900 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              <FaHome /> Go Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex-1 flex items-center justify-center gap-2 bg-transparent border-2 border-white hover:bg-white/10 font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-white/70 text-sm"
      >
        Error code: 403 - Forbidden
      </motion.div>
    </motion.div>
  );
};

export default Unauthorized;