import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '../utils';
import { checkAdmin } from '../utils/useUser';
import { useAuth } from '../hook/useAuth';
import { Bed, Check, Home, Users, UserRound, BarChart4, Loader2, AlertCircle, DollarSign } from 'lucide-react';
import StatCard from '../components/StatCard';

const AdminProfile = () => {
  const { user } = useAuth();

  // Check admin status
  const { data: isAdmin, isLoading: isAdminLoading, error: adminError } = useQuery({
    queryKey: ['adminCheck', user?.email],
    queryFn: () => checkAdmin(user?.email),
    enabled: !!user?.email,
  });
  
  // Fetch admin stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
    enabled: isAdmin, 
  });

  // Calculate percentages based on the stats
  const availablePercentage = stats ? (stats.availableApartments / stats.apartments * 100) : 0;
  const unavailablePercentage = stats ? 100 - availablePercentage : 0;

  if (isAdminLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (adminError || !isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-error shadow-lg max-w-2xl animate-fade-in">
          <AlertCircle className="w-6 h-6" />
          <span>Error: {adminError?.message || 'You do not have admin privileges'}</span>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-error shadow-lg max-w-2xl animate-fade-in">
          <AlertCircle className="w-6 h-6" />
          <span>Error: {statsError.message || 'Failed to load statistics'}</span>
        </div>
      </div>
    );
  }

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Apartments" 
          value={stats?.apartments || 0}
          icon={<Home className="w-6 h-6" />}
          color="primary"
          description="Total apartments in system"
        />
        <StatCard 
          title="Available" 
          value={`${availablePercentage.toFixed(2)}%`}
          icon={<Check className="w-6 h-6" />}
          color="success"
          description="Available apartments"
        />
        <StatCard 
          title="Unavailable" 
          value={`${unavailablePercentage.toFixed(2)}%`}
          icon={<Bed className="w-6 h-6" />}
          color="warning"
          description="Occupied or under agreement"
        />
        <StatCard 
          title="Total Users" 
          value={stats?.users || 0}
          icon={<Users className="w-6 h-6" />}
          color="info"
          description="Registered users"
        />
        <StatCard 
          title="Members" 
          value={stats?.members || 0}
          icon={<UserRound className="w-6 h-6" />}
          color="secondary"
          description="Premium members"
        />
        <StatCard 
          title="Payments" 
          value={stats?.payments || 0}
          icon={<DollarSign className="w-6 h-6" />}
          color="accent"
          description="Total transactions"
        />
        <StatCard 
          title="Revenue" 
          value={`$${stats?.revenue || 0}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="success"
          description="Total revenue"
        />
        <StatCard 
          title="Available Units" 
          value={stats?.availableApartments || 0}
          icon={<Home className="w-6 h-6" />}
          color="info"
          description="Ready for booking"
        />
      </div>

      {/* Additional Stats Section */}
      <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-2xl border border-base-200">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart4 className="w-5 h-5" />
          Detailed Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="stats bg-base-100 shadow">
            <div className="stat">
              <div className="stat-title">Total Apartments</div>
              <div className="stat-value">{stats?.apartments || 0}</div>
              <div className="stat-desc">In the database</div>
            </div>
          </div>
          
          <div className="stats bg-base-100 shadow">
            <div className="stat">
              <div className="stat-title">Available Apartments</div>
              <div className="stat-value">{stats?.availableApartments || 0}</div>
              <div className="stat-desc">{availablePercentage.toFixed(2)}% of total</div>
            </div>
          </div>
          
          <div className="stats bg-base-100 shadow">
            <div className="stat">
              <div className="stat-title">Total Users</div>
              <div className="stat-value">{stats?.users || 0}</div>
              <div className="stat-desc">Registered in system</div>
            </div>
          </div>
          
          <div className="stats bg-base-100 shadow">
            <div className="stat">
              <div className="stat-title">Premium Members</div>
              <div className="stat-value">{stats?.members || 0}</div>
              <div className="stat-desc">{stats?.users ? ((stats.members / stats.users * 100).toFixed(2) + '% of users') : '0%'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;