import { NavLink, useLoaderData, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hook/useAuth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ApartmentsList = () => {
  const apartments = useLoaderData();
  const {user} = useAuth();
  const [filtered, setFiltered] = useState(apartments);
  const [currentPage, setCurrentPage] = useState(1);
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const apartmentsPerPage = 6;

  const navigate = useNavigate();


  const handleAgreement = (apartment)=>{
    if(!user) return navigate('/login')
      
      
      const agreement ={
        userName: user.displayName,
        userEmail: user.email,
        floor: apartment.floor_no,
        block : apartment.block_name,
        apartmentNo: apartment.apartment_no,
        rent: apartment.rent,
        status: 'pending' 
      };


      axios.post('http://localhost:5000/apartments', agreement)
      .then(()=>{
        Swal.fire('Applied!', "Your agreement is submitted.", "success")
      })
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
        {currentApartments.map((apt) => (
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
                  className="btn btn-outline btn-success"
                >
                  Agreement
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-outline"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ApartmentsList