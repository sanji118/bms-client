import { useState, useEffect } from "react";
import { useAuth } from "../hook/useAuth";
import axios from "axios";


const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/payments?email=${user.email}`);
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, [user.email]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>
      {payments.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Month</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-t">
                  <td className="py-3 px-4">{payment.month}</td>
                  <td className="py-3 px-4">${payment.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{payment.transactionId || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No payment history available.</p>
      )}
    </div>
  );
};

export default PaymentHistory;