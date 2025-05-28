import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate, getAgreementRequests, updateAgreementStatus } from '../utils';

const AgreementRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['agreementRequests'],
    queryFn: getAgreementRequests
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }) => updateAgreementStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['agreementRequests']);
    }
  });

  const handleStatusUpdate = (id, status) => {
    mutation.mutate({ id, status });
  };

  if (isLoading) return <div>Loading agreements...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Agreement Requests</h2>
      
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">User</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Floor</th>
                <th className="py-2 px-4 border">Block</th>
                <th className="py-2 px-4 border">Room</th>
                <th className="py-2 px-4 border">Rent</th>
                <th className="py-2 px-4 border">Request Date</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{request.userName}</td>
                  <td className="py-2 px-4 border">{request.userEmail}</td>
                  <td className="py-2 px-4 border text-center">{request.floor}</td>
                  <td className="py-2 px-4 border text-center">{request.block}</td>
                  <td className="py-2 px-4 border text-center">{request.roomNumber}</td>
                  <td className="py-2 px-4 border text-center">${request.rent}</td>
                  <td className="py-2 px-4 border text-center">{formatDate(request.createdAt)}</td>
                  <td className="py-2 px-4 border text-center space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'accepted')}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'rejected')}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
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