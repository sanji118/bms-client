import { useEffect, useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { formatDate, formatCurrency, getAgreements, getApartment } from '../utils';

const MemberProfile = () => {
  const { user } = useAuth();
  const [agreement, setAgreement] = useState(null);
  const [apartment, setApartment] = useState(null);

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const agreements = await getAgreements(user.email);
        if (agreements.length > 0) {
          const firstAgreement = agreements[0];
          setAgreement(firstAgreement);

          // Fetch apartment details using agreement.apartmentId
          if (firstAgreement.apartmentId) {
            const apt = await getApartment(firstAgreement.apartmentId);
            setApartment(apt);
          }
        }
      } catch (error) {
        console.error('Error fetching agreement or apartment:', error);
      }
    };

    if (user?.email) {
      fetchAgreement();
    }
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Picture and Info */}
        <div className="md:w-1/3">
          <div className="flex flex-col items-center">
            <img 
              src={user?.photoURL || '/default-avatar.png'} 
              alt="Profile" 
              className="w-32 h-32 rounded-full mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-center">{user?.displayName || 'No Name'}</h3>
            <p className="text-gray-600 text-center">{user?.email}</p>
          </div>
        </div>
        
        {/* Agreement and Apartment Info */}
        <div className="md:w-2/3">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Agreement Status</h4>
              <p className="mt-1">{agreement ? 'Accepted' : 'No agreement'}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Agreement Date</h4>
              <p className="mt-1">
                {agreement?.createdAt ? formatDate(agreement.createdAt) : 'None'}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Rented Apartment</h4>
              <p className="mt-1">
                {apartment ? `${apartment.block_name}-${apartment.apartment_no}` : 'None'}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Floor</h4>
              <p className="mt-1">{apartment?.floor_no || 'None'}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Block</h4>
              <p className="mt-1">{apartment?.block_name || 'None'}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Room No</h4>
              <p className="mt-1">{apartment?.apartment_no || 'None'}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Monthly Rent</h4>
              <p className="mt-1">
                {apartment ? formatCurrency(apartment.rent) : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
