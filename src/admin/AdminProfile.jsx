import { useEffect, useState } from 'react';
import { 
  FiHome, FiUsers, FiFileText, FiDollarSign, 
  FiPieChart, FiAlertCircle, FiCheckCircle,
  FiCalendar, FiSettings, FiBell
} from 'react-icons/fi';
import StatCard from '../components/StatCard';
import ActivityTimeline from '../components/ActivityTimeline';
import RevenueChart from '../components/RevenueChart';
import OccupancyChart from '../components/OccupancyChart';

const AdminProfile = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/admin/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 300000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!stats) return <div className="p-4">No data available</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">
            Last updated: {new Date(stats.metadata.lastUpdated).toLocaleString()}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
          <FiSettings /> Settings
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FiHome size={20} />}
          title="Total Apartments"
          value={stats.apartments.total}
          change={null}
          color="blue"
        />
        <StatCard 
          icon={<FiPieChart size={20} />}
          title="Occupancy Rate"
          value={`${stats.apartments.occupiedPercentage}%`}
          change={null}
          color="green"
        />
        <StatCard 
          icon={<FiUsers size={20} />}
          title="Community Members"
          value={stats.users.members}
          change={null}
          color="purple"
        />
        <StatCard 
          icon={<FiDollarSign size={20} />}
          title="Total Revenue"
          value={`$${stats.payments.revenue.totalRevenue.toLocaleString()}`}
          change={null}
          color="teal"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Monthly Revenue</h3>
          <RevenueChart data={stats.payments} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Occupancy Overview</h3>
          <OccupancyChart data={stats.apartments} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            <button className="text-blue-600 text-sm flex items-center gap-1">
              View all <FiArrowRight size={14} />
            </button>
          </div>
          <ActivityTimeline activities={stats.recentActivity} />
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Available Apartments</span>
                <span className="font-medium">{stats.apartments.available}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Agreements</span>
                <span className="font-medium">{stats.agreements.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payments</span>
                <span className="font-medium">{stats.payments.recent}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg text-sm">
                <FiHome size={16} /> Add Apartment
              </button>
              <button className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 p-3 rounded-lg text-sm">
                <FiUserPlus size={16} /> Add Member
              </button>
              <button className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 rounded-lg text-sm">
                <FiBell size={16} /> Send Alert
              </button>
              <button className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-3 rounded-lg text-sm">
                <FiFileText size={16} /> Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;