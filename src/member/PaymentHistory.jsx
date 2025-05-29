import { useEffect, useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { formatCurrency, formatDate, getPayments } from '../utils';
import { FiDollarSign, FiCalendar, FiCheckCircle, FiClock, FiAward, FiCreditCard } from 'react-icons/fi';
import { FaRegSadTear } from 'react-icons/fa';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments(user.email);
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchPayments();
    }
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <FiCreditCard className="text-4xl text-blue-500 mb-3" />
        <p className="text-gray-600">Loading payment history...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          <FiDollarSign className="mr-3 text-blue-600" />
          Payment History
        </h2>
        {payments.length > 0 && (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            {payments.length} {payments.length === 1 ? 'payment' : 'payments'}
          </div>
        )}
      </div>
      
      {payments.length === 0 ? (
        <div className="text-center py-12">
          <FaRegSadTear className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No payment history available</p>
          <p className="text-gray-500 mt-2">Your payments will appear here once made</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" /> Date
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiAward className="mr-2" /> Discount
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={payment._id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <FiCalendar className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{formatDate(payment.createdAt)}</div>
                        <div className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.month}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.discountAmount ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {payment.discountAmount}% OFF
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {payment.status === 'completed' ? (
                        <FiCheckCircle className="text-green-500 mr-2" />
                      ) : (
                        <FiClock className="text-yellow-500 mr-2" />
                      )}
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {payments.length > 0 && (
        <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing <span className="font-medium">{payments.length}</span> payments
          </div>
          <div className="flex items-center">
            <FiCreditCard className="mr-2" />
            All transactions secured
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;