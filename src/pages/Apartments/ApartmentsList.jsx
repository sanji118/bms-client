import { useLoaderData, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/useAuth';
import { useEffect, useState } from 'react';
import { createAgreement, getAgreements ,formatDate} from '../../utils';
import Swal from 'sweetalert2';
import RequestAgreement from '../../member/RequestAgreement';

const ApartmentsList = () => {
  const apartments = useLoaderData();
  const { user } = useAuth();
  const [filtered, setFiltered] = useState(apartments);
  const [currentPage, setCurrentPage] = useState(1);
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [userAgreements, setUserAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [agreementForm, setAgreementForm] = useState({
    startDate: '',
    endDate: '',
    termsAccepted: false,
    specialRequests: ''
  });
  const apartmentsPerPage = 6;
  const navigate = useNavigate();

  // Fetch user's agreements
  useEffect(() => {
    const fetchAgreements = async () => {
      if (user?.email) {
        try {
          const agreements = await getAgreements(user.email);
          setUserAgreements(agreements);
        } catch (error) {
          console.error('Error fetching agreements:', error);
        }
      }
    };

    fetchAgreements();
  }, [user]);

  const handleAgreementClick = (apartment) => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'You need to login to request an agreement',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) navigate('/login');
      });
      return;
    }

    setSelectedApartment(apartment);
    setShowAgreementModal(true);
  };

  const handleAgreementSubmit = async () => {
    if (!agreementForm.termsAccepted) {
      Swal.fire('Error', 'You must accept the terms and conditions', 'error');
      return;
    }

    if (!agreementForm.startDate || !agreementForm.endDate) {
      Swal.fire('Error', 'Please select both start and end dates', 'error');
      return;
    }

    setLoading(true);

    try {
      // Check for existing agreement
      const existingAgreement = userAgreements.find(
        agreement => agreement.apartmentNo === selectedApartment.apartment_no && 
                    agreement.block === selectedApartment.block_name &&
                    agreement.floor === selectedApartment.floor_no
      );

      if (existingAgreement) {
        const statusMessage = {
          pending: 'You already have a pending agreement for this apartment',
          accepted: 'You are already a member of this apartment',
          rejected: 'Your previous agreement request was rejected'
        };
        Swal.fire(existingAgreement.status.charAt(0).toUpperCase() + existingAgreement.status.slice(1), 
                 statusMessage[existingAgreement.status], 
                 'info');
        return;
      }

      // Check if user is already a member elsewhere
      if (userAgreements.some(a => a.status === 'accepted')) {
        Swal.fire('Already Member', 'You can only rent one apartment at a time', 'warning');
        return;
      }

      // Submit new agreement
      const agreementData = {
        userName: user.displayName,
        userEmail: user.email,
        userId: user.uid,
        apartmentId: selectedApartment._id,
        floor: selectedApartment.floor_no,
        block: selectedApartment.block_name,
        apartmentNo: selectedApartment.apartment_no,
        rent: selectedApartment.rent,
        status: 'pending',
        requestDate: new Date().toISOString(),
        startDate: agreementForm.startDate,
        endDate: agreementForm.endDate,
        specialRequests: agreementForm.specialRequests
      };

      const response = await createAgreement(agreementData);

      if (response) {
        Swal.fire('Success!', 'Agreement request submitted', 'success');
        // Refresh agreements
        const agreements = await getAgreements(user.email);
        setUserAgreements(agreements);
        setShowAgreementModal(false);
      }
    } catch (error) {
      console.error('Agreement error:', error);
      Swal.fire('Error', error.response?.data?.error || 'Failed to submit agreement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getButtonState = (apartment) => {
    if (!user) {
      return {
        text: 'Agreement',
        className: 'btn btn-outline btn-success',
        disabled: false,
        tooltip: 'Login to request agreement'
      };
    }

    const existingAgreement = userAgreements.find(
      a => a.apartmentNo === apartment.apartment_no && 
           a.block === apartment.block_name && 
           a.floor === apartment.floor_no
    );

    if (existingAgreement) {
      return {
        text: existingAgreement.status === 'accepted' ? 'Renting' : 
              existingAgreement.status === 'pending' ? 'Pending' : 'Rejected',
        className: existingAgreement.status === 'accepted' ? 'btn btn-success' :
                  existingAgreement.status === 'pending' ? 'btn btn-warning' : 'btn btn-error',
        disabled: true,
        tooltip: existingAgreement.status === 'accepted' ? 'You are renting this apartment' :
                 existingAgreement.status === 'pending' ? 'Waiting for approval' : 'Request was rejected'
      };
    }

    if (userAgreements.some(a => a.status === 'accepted')) {
      return {
        text: 'Already Renting',
        className: 'btn btn-info',
        disabled: true,
        tooltip: 'You can only rent one apartment'
      };
    }

    return {
      text: 'Request Agreement',
      className: 'btn btn-outline btn-success',
      disabled: false,
      tooltip: 'Click to request agreement'
    };
  };

  // Filter and pagination logic
  const handleSearch = () => {
    const filtered = apartments.filter(
      apt => (!minRent || apt.rent >= +minRent) && (!maxRent || apt.rent <= +maxRent)
    );
    setFiltered(filtered);
    setCurrentPage(1);
  };

  // Pagination calculations
  const lastIndex = currentPage * apartmentsPerPage;
  const firstIndex = lastIndex - apartmentsPerPage;
  const currentApartments = filtered.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filtered.length / apartmentsPerPage);

  return (
    <div className="p-6">
      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="number"
          placeholder="Min Rent"
          value={minRent}
          onChange={(e) => setMinRent(e.target.value)}
          className="input input-bordered w-32"
        />
        <input
          type="number"
          placeholder="Max Rent"
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
          className="input input-bordered w-32"
        />
        <button className="btn bg-yellow-500" onClick={handleSearch}>Search</button>
      </div>

      {/* Apartment Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentApartments.map((apt) => {
          const buttonState = getButtonState(apt);
          return (
            <div key={apt._id} className="card bg-base-100 shadow-xl">
              <figure>
                <img src={apt.image} alt="Apartment" className="h-52 w-full object-cover" />
              </figure>
              <div className="card-body text-lg">
                <h2 className="card-title">Apartment {apt.apartment_no}</h2>
                <p className="flex gap-2 opacity-80 font-semibold">Floor: {apt.floor_no}</p>
                <p className="opacity-80 font-semibold">Block: {apt.block_name}</p>
                <p className="opacity-80 font-semibold">
                  Rent: <span className="font-bold text-lg">{apt.rent}৳</span> /month
                </p>
                <div className="card-actions justify-end">
                  <button
                    onClick={() => handleAgreementClick(apt)}
                    className={buttonState.className}
                    disabled={buttonState.disabled}
                    title={buttonState.tooltip}
                  >
                    {buttonState.text}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agreement Request Modal */}
      {showAgreementModal && selectedApartment && (
        <RequestAgreement 
        loading={loading} 
        handleAgreementSubmit={handleAgreementSubmit}
        setShowAgreementModal={setShowAgreementModal}
        setAgreementForm={setAgreementForm}
        selectedApartment={selectedApartment}
        agreementForm={agreementForm} 
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${currentPage === i + 1 ? "bg-yellow-500" : "btn-outline"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApartmentsList;