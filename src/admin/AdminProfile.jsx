import { useEffect, useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { getAdminStats } from '../utils';

const AdminProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading admin profile...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="flex flex-col items-center">
            <img 
              src="https://i.postimg.cc/bwYZvvQw/wandering-tales-mum8yz-Pu2sk-unsplash.png" 
              alt="Profile" 
              className="w-28 h-28 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">{user?.displayName || 'Admin'}</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h3 className="text-xl font-semibold mb-4">Building Statistics</h3>
          
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">Total Rooms</h4>
                <p className="text-3xl font-bold mt-2">{stats.totalRooms}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800">Available Rooms</h4>
                <p className="text-3xl font-bold mt-2">{stats.availablePercentage}%</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800">Occupied Rooms</h4>
                <p className="text-3xl font-bold mt-2">{stats.unavailablePercentage}%</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">Total Users</h4>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800">Total Members</h4>
                <p className="text-3xl font-bold mt-2">{stats.totalMembers}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;