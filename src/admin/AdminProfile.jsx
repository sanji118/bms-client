import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../utils';
import { useAuth } from '../hook/useAuth';
import { Bed, Check, Home, User, User2 } from 'lucide-react';
import StatCard from '../components/StatCard'

const AdminProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (error) return (
    <div className="alert alert-error max-w-2xl mx-auto mt-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Error: {error}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Admin Profile Card */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Admin" />
                ) : (
                  <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center text-4xl font-bold">
                    {user?.displayName?.charAt(0) || 'A'}
                  </div>
                )}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="card-title text-2xl">{user?.displayName || 'Admin'}</h2>
              <p className="text-gray-500">{user?.email}</p>
              <div className="badge badge-primary mt-2">ADMIN</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          title="Total Rooms" 
          value={stats?.totalRooms || 0}
          icon={<Home></Home>}
          color="primary"
        />
        <StatCard 
          title="Available" 
          value={`${stats?.availableRoomsPercentage?.toFixed(2) || 0}%`}
          icon={<Check></Check>}
          color="success"
        />
        <StatCard 
          title="Occupied" 
          value={`${stats?.occupiedRoomsPercentage?.toFixed(2) || 0}%`}
          icon={<Bed/>}
          color="warning"
        />
        <StatCard 
          title="Users" 
          value={stats?.totalUsers || 0}
          icon={<User2/>}
          color="info"
        />
        <StatCard 
          title="Members" 
          value={stats?.totalMembers || 0}
          icon={<User/>}
          color="secondary"
        />
      </div>
    </div>
  );
};



export default AdminProfile;