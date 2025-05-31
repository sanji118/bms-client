import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { getAgreementRequests, updateAgreementStatus } from '../utils/useAgreement';
import { formatDate } from '../utils';
import { updateApartment } from '../utils/useApartment'; 

const AgreementRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['agreementRequests'],
    queryFn: async () => {
      const data = await getAgreementRequests();
      return data.filter(request => request.status === 'pending');
    }
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status, apartmentId }) => {
      
      await updateAgreementStatus(id, status);
      
      
      if (status === 'accepted' && apartmentId) {
        await updateApartment(apartmentId, { status: 'unavailable' });
      }
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries(['agreementRequests']);
      queryClient.invalidateQueries(['apartments']);
    },
    onError: (error) => {
      // //console.error('Error updating agreement:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to update agreement status',
        icon: 'error',
      });
    }
  });

  const handleStatusUpdate = async (id, status, apartmentId) => {
    const actionText = status === 'accepted' 
      ? 'accept this request and mark the apartment as unavailable' 
      : 'reject this request';

    const result = await Swal.fire({
      title: `Are you sure you want to ${actionText}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: status === 'accepted' ? '#16a34a' : '#dc2626',
    });

    if (result.isConfirmed) {
      try {
        await mutation.mutateAsync({ id, status, apartmentId });
        Swal.fire({
          title: `Request ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
          text: status === 'accepted' ? 'The apartment has been marked as unavailable.' : '',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        
      }
    }
  };

  if (isLoading) return <div className="text-center py-10 text-lg">Loading agreement requests...</div>;

  return (
    <div className="bg-white p-8 shadow-lg border-l border-l-fuchsia-400">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Agreement Requests</h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No pending requests.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 border">User</th>
                <th className="py-3 px-4 border">Email</th>
                <th className="py-3 px-4 border">Floor</th>
                <th className="py-3 px-4 border">Block</th>
                <th className="py-3 px-4 border">Room</th>
                <th className="py-3 px-4 border">Rent</th>
                <th className="py-3 px-4 border">Request Date</th>
                <th className="py-3 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center text-gray-800">
              {requests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50 transition-all">
                  <td className="py-3 px-4 border text-amber-700">{request.userName}</td>
                  <td className="py-3 px-4 border">{request.userEmail}</td>
                  <td className="py-3 px-4 border">{request.floor}</td>
                  <td className="py-3 px-4 border">{request.block}</td>
                  <td className="py-3 px-4 border">{request.roomNumber}</td>
                  <td className="py-3 px-4 border">${request.rent}</td>
                  <td className="py-3 px-4 border">{formatDate(request.createdAt)}</td>
                  <td className="py-3 px-4 border space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'accepted', request.apartmentId)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 mx-auto transition-colors"
                      disabled={mutation.isLoading}
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'rejected', request.apartmentId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 mx-auto transition-colors"
                      disabled={mutation.isLoading}
                    >
                      <FaTimes /> Reject
                    </button>
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

export default AgreementRequests;