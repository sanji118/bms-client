import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/useAuth';
import { useEffect, useState } from 'react';
import { createAgreement, getUserAgreements } from '../../utils/useAgreement';
import Swal from 'sweetalert2';
import RequestAgreement from '../../member/RequestAgreement';
import { useQuery } from '@tanstack/react-query';
import { LoaderPinwheelIcon } from 'lucide-react';
import { getApartments } from '../../utils/useApartment';

const ApartmentsList = () => {
  const { data: apartments = [], isLoading, error } = useQuery({
    queryKey: ['apartments'],
    queryFn: getApartments,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const { user } = useAuth();
  const [filtered, setFiltered] = useState([]);
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

  useEffect(() => {
    if (apartments.length) setFiltered(apartments);
  }, [apartments]);

  useEffect(() => {
    const fetchAgreements = async () => {
      if (user?.email) {
        const res = await getUserAgreements(user.email);
        setUserAgreements(res);
      }
    };
    fetchAgreements();
  }, [user]);

  if (isLoading) return <div className="flex justify-center p-10"><LoaderPinwheelIcon className="animate-spin w-10 h-10" /></div>;
  if (error) return <div className="text-red-500 text-center">{error.message}</div>;

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
    if (!agreementForm.termsAccepted || !agreementForm.startDate || !agreementForm.endDate) {
      Swal.fire('Error', 'Please complete all required fields and accept terms.', 'error');
      return;
    }

    setLoading(true);
    try {
      const exists = userAgreements.find(
        a => a.apartmentNo === selectedApartment.apartment_no &&
             a.block === selectedApartment.block_name &&
             a.floor === selectedApartment.floor_no
      );
      if (exists) {
        Swal.fire('Notice', `You already have a ${exists.status} agreement for this apartment.`, 'info');
        return;
      }
      if (userAgreements.some(a => a.status === 'accepted')) {
        Swal.fire('Already Renting', 'You can only rent one apartment at a time.', 'warning');
        return;
      }

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

      await createAgreement(agreementData);
      Swal.fire('Success!', 'Agreement request submitted.', 'success');
      const updated = await getUserAgreements(user.email);
      setUserAgreements(updated);
      setShowAgreementModal(false);
    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || 'Failed to submit agreement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getButtonState = (apt) => {
    if (!user) return { text: 'Agreement', className: 'btn btn-outline btn-success', disabled: false, tooltip: 'Login to request agreement' };
    const exist = userAgreements.find(a => a.apartmentNo === apt.apartment_no && a.block === apt.block_name && a.floor === apt.floor_no);
    if (exist) {
      const btnStyle = exist.status === 'accepted' ? 'btn-success' : exist.status === 'pending' ? 'btn-warning' : 'btn-error';
      return { text: exist.status.charAt(0).toUpperCase() + exist.status.slice(1), className: `btn ${btnStyle}`, disabled: true, tooltip: exist.status };
    }
    if (userAgreements.some(a => a.status === 'accepted')) return { text: 'Already Renting', className: 'btn btn-info', disabled: true, tooltip: 'Only one apartment allowed' };
    return { text: 'Request Agreement', className: 'btn btn-outline btn-success', disabled: false, tooltip: 'Click to request agreement' };
  };

  const handleSearch = () => {
    const filtered = apartments.filter(
      apt => (!minRent || apt.rent >= +minRent) && (!maxRent || apt.rent <= +maxRent)
    );
    setFiltered(filtered);
    setCurrentPage(1);
  };

  const lastIndex = currentPage * apartmentsPerPage;
  const currentApartments = filtered.slice(lastIndex - apartmentsPerPage, lastIndex);
  const totalPages = Math.ceil(filtered.length / apartmentsPerPage);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <input type="number" placeholder="Min Rent" value={minRent} onChange={e => setMinRent(e.target.value)} className="input input-bordered w-32" />
        <input type="number" placeholder="Max Rent" value={maxRent} onChange={e => setMaxRent(e.target.value)} className="input input-bordered w-32" />
        <button className="btn bg-yellow-500" onClick={handleSearch}>Search</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentApartments.map((apt) => {
          const btn = getButtonState(apt);
          return (
            <div key={apt._id} className="card bg-base-100 shadow-xl">
              <figure><img src={apt.image} alt="Apartment" className="h-52 w-full object-cover" /></figure>
              <div className="card-body text-lg">
                <h2 className="card-title">Apartment {apt.apartment_no}</h2>
                <p>Floor: {apt.floor_no}</p>
                <p>Block: {apt.block_name}</p>
                <p>Rent: <span className="font-bold">{apt.rent}৳</span>/month</p>
                <div className="card-actions justify-end">
                  <button onClick={() => handleAgreementClick(apt)} className={btn.className} disabled={btn.disabled} title={btn.tooltip}>{btn.text}</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${currentPage === i + 1 ? 'bg-yellow-500' : 'btn-outline'}`}
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
