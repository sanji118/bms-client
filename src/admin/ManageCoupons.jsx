import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercentage: "",
    description: ""
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('http://localhost:5000/coupons');
        setCoupons(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coupons:', error);
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/coupons', newCoupon);
      setCoupons([...coupons, response.data]);
      setShowModal(false);
      setNewCoupon({
        code: "",
        discountPercentage: "",
        description: ""
      });
      Swal.fire(
        'Success!',
        'Coupon has been added.',
        'success'
      );
    } catch (error) {
      Swal.fire(
        'Error!',
        'Failed to add coupon.',
        'error'
      );
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/coupons/${couponId}`);
        setCoupons(coupons.filter(coupon => coupon._id !== couponId));
        Swal.fire(
          'Deleted!',
          'The coupon has been deleted.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error!',
          'Failed to delete coupon.',
          'error'
        );
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Coupons</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Add Coupon
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Coupon Code</th>
                <th className="py-3 px-4 text-left">Discount (%)</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-t">
                    <td className="py-3 px-4">{coupon.code}</td>
                    <td className="py-3 px-4">{coupon.discountPercentage}</td>
                    <td className="py-3 px-4">{coupon.description}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Coupon</h3>
            <form onSubmit={handleAddCoupon}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Coupon Code:</label>
                <input
                  type="text"
                  name="code"
                  className="w-full p-2 border rounded"
                  value={newCoupon.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Discount Percentage:</label>
                <input
                  type="number"
                  name="discountPercentage"
                  min="1"
                  max="100"
                  className="w-full p-2 border rounded"
                  value={newCoupon.discountPercentage}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Description:</label>
                <textarea
                  name="description"
                  className="w-full p-2 border rounded"
                  value={newCoupon.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Add Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;