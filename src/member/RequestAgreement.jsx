
import { formatDate } from '../utils';

const RequestAgreement = ({selectedApartment, loading, handleAgreementSubmit, setShowAgreementModal, setAgreementForm, agreementForm,  }) => {


  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Request Agreement for Apartment {selectedApartment.apartment_no}</h3>
            
            <div className="mb-4">
            <label className="block mb-2 font-medium">Apartment Details</label>
            <div className="bg-gray-50 p-3 rounded">
                <p>Block: {selectedApartment.block_name}</p>
                <p>Floor: {selectedApartment.floor_no}</p>
                <p>Rent: {selectedApartment.rent}৳ per month</p>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block mb-2 font-medium">Start Date</label>
                <input
                type="date"
                className="w-full p-2 border rounded"
                value={agreementForm.startDate}
                onChange={(e) => setAgreementForm({...agreementForm, startDate: e.target.value})}
                min={formatDate(new Date(), 'yyyy-MM-dd')}
                required
                />
            </div>
            <div>
                <label className="block mb-2 font-medium">End Date</label>
                <input
                type="date"
                className="w-full p-2 border rounded"
                value={agreementForm.endDate}
                onChange={(e) => setAgreementForm({...agreementForm, endDate: e.target.value})}
                min={agreementForm.startDate || formatDate(new Date(), 'yyyy-MM-dd')}
                required
                />
            </div>
            </div>

            <div className="mb-4">
            <label className="block mb-2 font-medium">Special Requests</label>
            <textarea
                className="w-full p-2 border rounded"
                rows="3"
                value={agreementForm.specialRequests}
                onChange={(e) => setAgreementForm({...agreementForm, specialRequests: e.target.value})}
                placeholder="Any special requests or conditions"
            />
            </div>

            <div className="mb-4 flex items-center">
            <input
                type="checkbox"
                id="terms"
                className="mr-2"
                checked={agreementForm.termsAccepted}
                onChange={(e) => setAgreementForm({...agreementForm, termsAccepted: e.target.checked})}
            />
            <label htmlFor="terms">I agree to the terms and conditions</label>
            </div>

            <div className="flex justify-end gap-3">
            <button
                className="btn btn-ghost"
                onClick={() => setShowAgreementModal(false)}
                disabled={loading}
            >
                Cancel
            </button>
            <button
                className="btn bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={handleAgreementSubmit}
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            </div>
        </div>
        </div>
    </div>
  );
};

export default RequestAgreement;