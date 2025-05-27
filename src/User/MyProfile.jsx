import { useAuth } from "../hook/useAuth";


const MyProfile = () => {
  const { user } = useAuth();

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
            <span>None</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Floor:</span>
            <span>None</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Block:</span>
            <span>None</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Room No:</span>
            <span>None</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;