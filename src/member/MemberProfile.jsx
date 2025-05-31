import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hook/useAuth';
import { formatDate, formatCurrency } from '../utils';
import { getUserAgreements } from '../utils/useAgreement';
import { getApartment } from '../utils/useApartment';
import { checkMember } from '../utils/useUser';
import { FaBuilding, FaUserCheck, FaCalendarAlt, FaMoneyBillWave, FaLayerGroup } from 'react-icons/fa';

const MemberProfile = () => {
  const { user } = useAuth();
  const [agreement, setAgreement] = useState(null);
  const [apartment, setApartment] = useState(null);

 
  const { data: isMember, isLoading: isMemberLoading, error: memberError } = useQuery({
  queryKey: ['memberStatus', user?.email],
  queryFn: () => checkMember(user?.email),
  enabled: !!user?.email,
});

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const agreements = await getUserAgreements(user.email);
        if (agreements.length > 0) {
          const firstAgreement = agreements[0];
          setAgreement(firstAgreement);

          if (firstAgreement.apartmentId) {
            const apt = await getApartment(firstAgreement.apartmentId);
            setApartment(apt);
          }
        }
      } catch (error) {
        // //console.error('Error fetching agreement or apartment:', error);
      }
    };

    if (user?.email) {
      fetchAgreement();
    }
  }, [user]);

  if (isMemberLoading) {
    return <div>Loading member status...</div>;
  }

  if (memberError) {
    return <div>Error checking member status: {memberError.message}</div>;
  }

  return (
    <div className="bg-base-100 p-8 border-l border-l-amber-300 shadow-xl max-w-5xl mx-auto ">
      <h2 className="text-3xl font-bold mb-8 text-center text-cyan-600">Member Profile</h2>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Section */}
        <div className="w-full md:w-1/3 flex flex-col items-center text-center">
          <div className="avatar mb-4">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user?.photoURL || '/default-avatar.png'} alt="Profile" />
            </div>
          </div>
          <h3 className="text-xl font-semibold">{user?.displayName || 'No Name'}</h3>
          <p className="text-gray-500">{user?.email}</p>
          {/* Display member status */}
          <div className="mt-2">
            <span className={`badge ${isMember ? 'badge-success' : 'badge-error'}`}>
              {isMember ? 'Member' : 'Not a Member'}
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              icon={<FaUserCheck className="text-green-500 text-xl" />}
              label="Agreement Status"
              value={agreement ? 'Accepted' : 'No agreement'}
            />
            <InfoCard
              icon={<FaCalendarAlt className="text-blue-500 text-xl" />}
              label="Agreement Date"
              value={agreement?.createdAt ? formatDate(agreement.createdAt) : 'None'}
            />
            <InfoCard
              icon={<FaBuilding className="text-indigo-500 text-xl" />}
              label="Rented Apartment"
              value={apartment ? `${apartment.block_name}-${apartment.apartment_no}` : 'None'}
            />
            <InfoCard
              icon={<FaLayerGroup className="text-yellow-500 text-xl" />}
              label="Floor"
              value={apartment?.floor_no || 'None'}
            />
            <InfoCard
              icon={<FaLayerGroup className="text-purple-500 text-xl" />}
              label="Block"
              value={apartment?.block_name || 'None'}
            />
            <InfoCard
              icon={<FaLayerGroup className="text-pink-500 text-xl" />}
              label="Room No"
              value={apartment?.apartment_no || 'None'}
            />
            <InfoCard
              icon={<FaMoneyBillWave className="text-emerald-500 text-xl" />}
              label="Monthly Rent"
              value={apartment ? formatCurrency(apartment.rent) : 'None'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-base-200 rounded-xl p-4 shadow hover:shadow-lg transition">
    <div className="flex items-center gap-3 mb-1">
      <span>{icon}</span>
      <h4 className="font-medium text-gray-700">{label}</h4>
    </div>
    <p className="text-gray-900 font-semibold">{value}</p>
  </div>
);

export default MemberProfile;