import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hook/useAuth';

const RequestAgreement = ({ apartment }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const mutation = useMutation({
    mutationFn: createAgreement,
    onSuccess: () => {
      queryClient.invalidateQueries(['agreements']);
      alert('Agreement request submitted!');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('You must accept the terms');
      return;
    }

    const agreementData = {
      userEmail: user.email,
      userName: user.displayName,
      apartmentId: apartment._id,
      floor: apartment.floor_no,
      block: apartment.block_name,
      roomNumber: apartment.roomNumber,
      rent: apartment.rent,
      status: 'pending'
    };

    mutation.mutate(agreementData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Request Rental Agreement</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2"
            />
            <span>I agree to the rental terms and conditions</span>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Floor</label>
            <input
              type="text"
              value={apartment.floor}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Block</label>
            <input
              type="text"
              value={apartment.block}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Room Number</label>
            <input
              type="text"
              value={apartment.roomNumber}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Monthly Rent</label>
            <input
              type="text"
              value={`$${apartment.rent}`}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {mutation.isLoading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestAgreement;