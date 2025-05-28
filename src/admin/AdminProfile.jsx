import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../utils';
import { useAuth } from '../hook/useAuth';
import { Bed, Check, Home, Users, UserRound, BarChart4, Loader2, AlertCircle } from 'lucide-react';
import StatCard from '../components/StatCard';

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
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="alert alert-error shadow-lg max-w-2xl animate-fade-in">
        <AlertCircle className="w-6 h-6" />
        <span>Error: {error}</span>
      </div>
    </div>
  );
  console.log(stats)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100/80 backdrop-blur-sm shadow-2xl mb-8 transition-all duration-300 hover:shadow-primary/20 hover:shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-all duration-500 hover:ring-secondary hover:scale-105">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Admin" className="rounded-full" />
                ) : (
                  <div className="bg-gradient-to-br from-primary to-secondary text-neutral-content w-full h-full flex items-center justify-center text-4xl font-bold">
                    {user?.displayName?.charAt(0) || 'A'}
                  </div>
                )}
              </div>
            </div>
            <div className="text-center md:text-left space-y-2">
              <h2 className="card-title text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {user?.displayName || 'Admin'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
              <div className="badge badge-error gap-2 mt-2 px-4 py-3 font-bold animate-pulse">
                <BarChart4 className="w-4 h-4" />
                ADMIN DASHBOARD
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with Hover Effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Total Rooms" 
          value={stats?.totalRooms || 0}
          icon={<Home className="w-6 h-6" />}
          color="yellow-200"
          trend={stats?.roomsTrend}
          description="Total available rooms"
          className="hover:scale-[1.02] transition-transform duration-300"
        />
        <StatCard 
          title="Available" 
          value={`${stats?.availableRoomsPercentage?.toFixed(2) || 0}%`}
          icon={<Check className="w-6 h-6" />}
          color="success"
          trend={stats?.availabilityTrend}
          description="Rooms ready for booking"
          className="hover:scale-[1.02] transition-transform duration-300"
        />
        <StatCard 
          title="Occupied" 
          value={`${stats?.occupiedRoomsPercentage?.toFixed(2) || 0}%`}
          icon={<Bed className="w-6 h-6" />}
          color="warning"
          trend={stats?.occupancyTrend}
          description="Currently occupied rooms"
          className="hover:scale-[1.02] transition-transform duration-300"
        />
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0}
          icon={<Users className="w-6 h-6" />}
          color="info"
          trend={stats?.usersTrend}
          description="Registered users"
          className="hover:scale-[1.02] transition-transform duration-300"
        />
        <StatCard 
          title="Members" 
          value={stats?.totalMembers || 0}
          icon={<UserRound className="w-6 h-6" />}
          color="secondary"
          trend={stats?.membersTrend}
          description="Premium members"
          className="hover:scale-[1.02] transition-transform duration-300"
        />
      </div>

      {/* Additional Stats Section */}
      {stats && (
        <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-2xl border border-base-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart4 className="w-5 h-5" />
            Performance Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stats bg-base-100 shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Check className="w-6 h-6" />
                </div>
                <div className="stat-title">Monthly Bookings</div>
                <div className="stat-value">{stats.monthlyBookings || 0}</div>
                <div className="stat-desc">↗︎ {stats.bookingIncrease || 0}% from last month</div>
              </div>
            </div>
            
            <div className="stats bg-base-100 shadow">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <UserRound className="w-6 h-6" />
                </div>
                <div className="stat-title">New Users</div>
                <div className="stat-value">{stats.newUsers || 0}</div>
                <div className="stat-desc">↗︎ {stats.userGrowth || 0}% growth</div>
              </div>
            </div>
            
            <div className="stats bg-base-100 shadow">
              <div className="stat">
                <div className="stat-figure text-warning">
                  <Bed className="w-6 h-6" />
                </div>
                <div className="stat-title">Avg. Occupancy</div>
                <div className="stat-value">{stats.avgOccupancy?.toFixed(1) || 0}%</div>
                <div className="stat-desc">↘︎ {stats.occupancyChange || 0}% from average</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;