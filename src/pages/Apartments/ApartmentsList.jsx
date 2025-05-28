import { NavLink, useLoaderData, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/useAuth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ApartmentsList = () => {
  const apartments = useLoaderData();
  const { user } = useAuth();
  const [filtered, setFiltered] = useState(apartments);
  const [currentPage, setCurrentPage] = useState(1);
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [userAgreements, setUserAgreements] = useState([]);
  const apartmentsPerPage = 6;

  const navigate = useNavigate();

  // Fetch user's agreements on component mount
  useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:5000/agreements?email=${user.email}`)
        .then(res => setUserAgreements(res.data))
        .catch(err => console.error('Error fetching agreements:', err));
    }
  }, [user]);

  const handleAgreement =async (apartment) => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'You need to login to request an agreement',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
        return;
      });
      try {
          const response = await axios.post('http://localhost:5000/agreements', {
            userName: user.displayName,
            userEmail: user.email,
            userId: user.uid,
            floor: apartment.floor_no,
            block: apartment.block_name,
            apartmentNo: apartment.apartment_no,
            rent: apartment.rent,
            status: 'pending'
          });

          if (response.status === 201) {
            Swal.fire('Success!', 'Agreement request submitted', 'success');
            // Refresh agreements list
            const agreementsResponse = await axios.get(
              `http://localhost:5000/agreements?email=${user.email}`
            );
            setUserAgreements(agreementsResponse.data);
          }
        } catch (error) {
          console.error('Agreement error:', error);
          Swal.fire(
            'Error', 
            error.response?.data?.error || 'Failed to submit agreement', 
            'error'
          );
        }
      };
    

    
    const existingAgreement = userAgreements.find(
      agreement => agreement.apartmentNo === apartment.apartment_no && agreement.block === apartment.block_name && agreement.floor === apartment.floor_no
    );

    if (existingAgreement) {
      if (existingAgreement.status === 'pending') {
        Swal.fire('Pending', 'You already have a pending agreement for this apartment', 'info');
      } else if (existingAgreement.status === 'accepted') {
        Swal.fire('Already Member', 'You are already a member of this apartment', 'info');
      } else {
        Swal.fire('Rejected', 'Your previous agreement request was rejected', 'warning');
      }
      return;
    }

    // Check if user is already a member (has any accepted agreement)
    const isMember = userAgreements.some(agreement => agreement.status === 'accepted');
    if (isMember) {
      Swal.fire('Already Member', 'You can only rent one apartment at a time', 'warning');
      return;
    }




    // Proceed with new agreement request
    const agreement = {
      userName: user.displayName,
      userEmail: user.email,
      userId: user.uid,
      floor: apartment.floor_no,
      block: apartment.block_name,
      apartmentNo: apartment.apartment_no,
      rent: apartment.rent,
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    axios.post('http://localhost:5000/agreements', agreement)
      .then(() => {
        Swal.fire('Applied!', 'Your agreement request has been submitted', 'success');
        // Refresh agreements list
        return axios.get(`http://localhost:5000/agreements?email=${user.email}`);
      })
      .then(res => setUserAgreements(res.data))
      .catch(error => {
        console.error('Error submitting agreement:', error);
        Swal.fire('Error', 'Failed to submit agreement request', 'error');
      });
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
      agreement => agreement.apartmentNo === apartment.apartment_no && agreement.block === apartment.block_name && agreement.floor === apartment.floor_no
    );

    if (existingAgreement) {
      if (existingAgreement.status === 'pending') {
        return {
          text: 'Pending Approval',
          className: 'btn btn-warning',
          disabled: true,
          tooltip: 'Your request is pending approval'
        };
      } else if (existingAgreement.status === 'accepted') {
        return {
          text: 'Already Renting',
          className: 'btn btn-success',
          disabled: true,
          tooltip: 'You are already renting this apartment'
        };
      } else {
        return {
          text: 'Request Rejected',
          className: 'btn btn-error',
          disabled: true,
          tooltip: 'Your previous request was rejected'
        };
      }
    }

    const isMember = userAgreements.some(agreement => agreement.status === 'accepted');
    if (isMember) {
      return {
        text: 'Already Renting',
        className: 'btn btn-info',
        disabled: true,
        tooltip: 'You can only rent one apartment at a time'
      };
    }

    return {
      text: 'Request Agreement',
      className: 'btn btn-outline btn-success',
      disabled: false,
      tooltip: 'Click to request agreement'
    };
  };
   const handleSearch = () => {
    const filtered = apartments.filter(
      apt =>
        (!minRent || apt.rent >= parseInt(minRent)) &&
        (!maxRent || apt.rent <= parseInt(maxRent))
    );
    setFiltered(filtered);
    setCurrentPage(1);
  };

  const lastIndex = currentPage * apartmentsPerPage;
  const firstIndex = lastIndex - apartmentsPerPage;
  const currentApartments = filtered.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filtered.length / apartmentsPerPage);

  

  return (
    <div className="p-6">
      {/* Rent Range Search */}
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
        {currentApartments?.map((apt) => {
          const buttonState = getButtonState(apt);
          return (
            <div key={apt._id} className="card bg-base-100 shadow-xl">
              <figure><img src={apt.image} alt="Apartment" className="h-52 w-full object-cover" /></figure>
              <div className="card-body text-lg">
                <h2 className="card-title">Apartment {apt.apartment_no}</h2>
                <p className='flex gap-2 opacity-80 font-semibold'>Floor: {apt.floor_no}</p>
                <p className='opacity-80 font-semibold'>Block: <span>{apt.block_name}</span></p>
                <p className='opacity-80 font-semibold'>Rent: <span className='font-bold text-lg'>{apt.rent}৳</span> /month</p>
                <div className="card-actions justify-end">
                  <button
                    onClick={() => handleAgreement(apt)}
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

      {/* Pagination */}
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
    </div>
  );
}

export default ApartmentsList;