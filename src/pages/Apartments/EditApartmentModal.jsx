import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApartment } from '../../utils/useApartment';
import Swal from 'sweetalert2';

const EditApartmentModal = ({ apartment, onClose, onSave }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    apartment_no: apartment.apartment_no,
    block_name: apartment.block_name,
    floor_no: apartment.floor_no,
    rent: apartment.rent,
    status: apartment.status,
    image: apartment.image
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData) => updateApartment(apartment._id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['apartments']);
      Swal.fire({
        title: 'Success!',
        text: 'Apartment updated successfully',
        icon: 'success',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      onSave();
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to update apartment',
        icon: 'error',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Apartment</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Apartment Number</label>
              <input
                type="text"
                name="apartment_no"
                value={formData.apartment_no}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Block Name</label>
              <input
                type="text"
                name="block_name"
                value={formData.block_name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Floor Number</label>
              <input
                type="number"
                name="floor_no"
                value={formData.floor_no}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rent</label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={updateMutation.isLoading}>
              {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditApartmentModal;