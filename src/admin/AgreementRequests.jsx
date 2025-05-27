import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AgreementRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/agreement-requests');
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId, userId) => {
    try {
      await axios.patch(`http://localhost:5000/agreement-requests/${requestId}`, {
        status: 'accepted',
        acceptDate: new Date().toISOString()
      });
      
      // Update user role to member
      await axios.patch(`http://localhost:5000/users/${userId}`, { role: 'member' });
      
      setRequests(requests.filter(request => request._id !== requestId));
      Swal.fire(
        'Accepted!',
        'The agreement request has been accepted.',
        'success'
      );
    } catch (error) {
      Swal.fire(
        'Error!',
        'Failed to accept request.',
        'error'
      );
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.patch(`http://localhost:5000/agreement-requests/${requestId}`, {
        status: 'rejected'
      });
      
      setRequests(requests.filter(request => request._id !== requestId));
      Swal.fire(
        'Rejected!',
        'The agreement request has been rejected.',
        'success'
      );
    } catch (error) {
      Swal.fire(
        'Error!',
        'Failed to reject request.',
        'error'
      );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Agreement Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">User Name</th>
                <th className="py-3 px-4 text-left">User Email</th>
                <th className="py-3 px-4 text-left">Floor</th>
                <th className="py-3 px-4 text-left">Block</th>
                <th className="py-3 px-4 text-left">Room No</th>
                <th className="py-3 px-4 text-left">Rent</th>
                <th className="py-3 px-4 text-left">Request Date</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request._id} className="border-t">
                    <td className="py-3 px-4">{request.userName}</td>
                    <td className="py-3 px-4">{request.userEmail}</td>
                    <td className="py-3 px-4">{request.floor}</td>
                    <td className="py-3 px-4">{request.block}</td>
                    <td className="py-3 px-4">{request.roomNo}</td>
                    <td className="py-3 px-4">${request.rent}</td>
                    <td className="py-3 px-4">{new Date(request.requestDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        onClick={() => handleAccept(request._id, request.userId)}
                        className="text-green-500 hover:text-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                    No agreement requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgreementRequests;