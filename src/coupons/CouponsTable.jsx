import { FiTrash2 } from 'react-icons/fi';
import { FaPercentage, FaDollarSign } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { formatDate } from '../utils';

const CouponsTable = ({ coupons, handleStatusChange, handleDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full bg-cyan-50">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Type</th>
            <th>Validity</th>
            <th>Min Amount</th>
            <th>Applicable For</th>
            <th>Reusable</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(coupon => (
            <tr key={coupon._id}>
              <td>{coupon.code}</td>
              <td>
                {coupon.type === 'percentage' ? (
                  <span className="flex items-center">
                    <FaPercentage className="mr-1" /> {coupon.discount}%
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaDollarSign className="mr-1" /> {coupon.discount}
                  </span>
                )}
              </td>
              <td>
                <span className={`badge ${coupon.type === 'percentage' ? 'badge-primary' : 'badge-secondary'}`}>
                  {coupon.type.toUpperCase()}
                </span>
              </td>
              <td>
                {formatDate(coupon.createdAt)} to {formatDate(coupon.expiryDate)}
              </td>
              <td>{coupon.minAmount ? `$${coupon.minAmount}` : 'None'}</td>
              <td>
                <div >
                  {coupon.applicableFor}
                </div>
              </td>
              <td>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={coupon.reusable}
                  disabled
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={coupon.status === 'active'}
                  onChange={(e) => handleStatusChange(coupon._id, e.target.checked)}
                />
              </td>
              <td>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="btn btn-ghost btn-sm text-error"
                >
                  <FiTrash2 className='text-xl text-red-600' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponsTable;