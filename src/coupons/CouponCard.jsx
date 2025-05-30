import { useState } from 'react';
import { motion } from 'framer-motion';
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
  },
  {
    name: 'purple',
    border: 'border-purple-300',
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    button: 'bg-purple-600 hover:bg-purple-700',
    gradient: 'from-purple-100 to-purple-50'
  }
];

const CouponCard = ({ coupon, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const color = COLOR_PALETTE[index % COLOR_PALETTE.length] || COLOR_PALETTE[0];

  const isNew = (new Date() - new Date(coupon.createdAt)) / (1000 * 60 * 60 * 24) < 7;

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

  const showSuccessAlert = (code) => {
    MySwal.fire({
      title: <p className="text-xl font-bold">Copied!</p>,
      html: <p>Coupon code <strong>{code}</strong> copied to clipboard</p>,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d97706',
      timer: 2000,
      timerProgressBar: true,
    });
  };

  return (
    <motion.div
      className="relative cursor-pointer h-full min-h-[300px] perspective-1000"
      whileHover={{ y: -5 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Front Side */}
      <motion.div
        initial="visible"
        animate={isFlipped ? "hidden" : "visible"}
        variants={flipVariants}
        className={`absolute inset-0 bg-white rounded-xl shadow-lg p-6 ${color.border} border-2 flex flex-col h-full backface-hidden`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="absolute top-4 right-4">
          <div className={`w-12 h-12 rounded-full ${color.bg} opacity-20`}></div>
        </div>

        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${color.bg} ${color.text}`}>
            {isNew ? 'NEW OFFER' : 'LIMITED TIME'}
          </span>
          <div className="text-right">
            <p className="text-sm text-gray-500">Expires</p>
            <p className="font-semibold">
              {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="text-center my-4 flex-grow flex flex-col justify-center">
          <p className="text-sm text-gray-600 mb-2">{coupon.description || 'Special discount'}</p>
          <h3 className={`text-5xl font-bold my-3 ${color.text}`}>
            {coupon.type === 'percentage' ?
              `${coupon.discount}% OFF` :
              `$${coupon.discount} OFF`}
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

      {/* Back Side */}
      <motion.div
        initial="hidden"
        animate={isFlipped ? "visible" : "hidden"}
        variants={flipVariants}
        className={`bg-white rounded-xl shadow-lg p-6 ${color.border} border-2 h-full flex flex-col backface-hidden`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="text-center mb-4">
          <h3 className={`text-3xl font-bold ${color.text}`}>
            {coupon.type === 'percentage' ?
              `${coupon.discount}% OFF` :
              `$${coupon.discount} OFF`}
          </h3>
          <div className="my-4">
            <div className={`inline-block px-4 py-2 rounded-lg ${color.bg} ${color.text} font-mono text-lg font-bold`}>
              {coupon.code}
            </div>
          </div>
        </div>

        <div className="mb-4 flex-grow">
          <p className="text-gray-700 mb-3 text-center">{coupon.description || 'Special discount'}</p>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm text-gray-600">
            <p><strong>Valid Until:</strong> {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Min Amount:</strong> ${coupon.minAmount}</p>
            <p><strong>Reusable:</strong> {coupon.reusable ? 'Yes' : 'No'}</p>
            <p><strong>Created By:</strong> {coupon.createdBy}</p>
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
};

export default CouponCard;
