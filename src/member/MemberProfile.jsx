import { useAuth } from '../hook/useAuth';
import { useEffect, useState } from 'react';
import { getAgreements } from '../utils';



const MemberProfile = () => {
  const { user } = useAuth();
  const [agreement, setAgreement] = useState(null);
  const [apartment, setApartment] = useState(null);

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const agreements = await getAgreements(user.email);
        if (agreements.length > 0) {
          setAgreement(agreements[0]);
          // In a real app, you would fetch apartment details using agreement.apartmentId
          setApartment({
            floor: '3',
            block: 'B',
            roomNo: '302',
            rent: 1200
          });
        }
      } catch (error) {
        console.error('Error fetching agreement:', error);
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
        <div className="md:w-1/3">
          <div className="flex flex-col items-center">
            <img 
              src={user?.photoURL || '/default-avatar.png'} 
              alt="Profile" 
              className="w-32 h-32 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">{user?.displayName || 'No Name'}</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Agreement Status</h4>
              <p className="mt-1">
                {agreement ? 'Accepted' : 'No agreement'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Agreement Date</h4>
              <p className="mt-1">
                {agreement ? formatDate(agreement.createdAt) : 'None'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Rented Apartment</h4>
              <p className="mt-1">
                {apartment ? `${apartment.block}-${apartment.apartmentNo}` : 'None'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Floor</h4>
              <p className="mt-1">
                {apartment ? apartment.floor : 'None'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Block</h4>
              <p className="mt-1">
                {apartment ? apartment.block : 'None'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Room No</h4>
              <p className="mt-1">
                {apartment ? apartment.apartmentNo : 'None'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Monthly Rent</h4>
              <p className="mt-1">
                {apartment ? `$${apartment.rent}` : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;