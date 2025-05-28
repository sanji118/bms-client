import { useQuery } from '@tanstack/react-query';
import { formatCurrency, formatDate, getPayments } from '../utils';
import { useAuth } from '../hook/useAuth';

const PaymentHistory = () => {
  const { user } = useAuth();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', user?.email],
    queryFn: () => getPayments(user?.email),
    enabled: !!user?.email
  });

  if (isLoading) return <div>Loading payment history...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>
      
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Month</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Discount</th>
                <th className="py-2 px-4 border">Coupon</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border text-center">{payment.month}</td>
                  <td className="py-2 px-4 border text-center">{formatCurrency(payment.amount)}</td>
                  <td className="py-2 px-4 border text-center">
                    {payment.discountAmount ? formatCurrency(payment.discountAmount) : '-'}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {payment.couponCode || '-'}
                  </td>
                  <td className="py-2 px-4 border text-center">{formatDate(payment.createdAt)}</td>
                  <td className="py-2 px-4 border text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;