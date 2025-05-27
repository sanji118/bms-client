import { useAuth } from "../hook/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";


const MemberProfile = () => {
  const { user } = useAuth();
  const [agreement, setAgreement] = useState(null);

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/agreements?email=${user.email}`);
        if (response.data.length > 0) {
          setAgreement(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching agreement:', error);
      }
    };

    fetchAgreement();
  }, [user.email]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={user?.photoURL || "https://i.ibb.co/M1q7YgV/default-user.png"} 
            alt="Profile" 
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold">{user?.displayName}</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Agreement Accept Date:</span>
            <span>
              {agreement?.status === 'accepted' 
                ? new Date(agreement?.acceptDate).toLocaleDateString() 
                : 'None'}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Floor:</span>
            <span>{agreement?.floor || 'None'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Block:</span>
            <span>{agreement?.block || 'None'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Room No:</span>
            <span>{agreement?.roomNo || 'None'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Rent:</span>
            <span>{agreement?.rent ? `$${agreement.rent}` : 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;