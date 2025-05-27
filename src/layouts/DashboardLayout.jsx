import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import {
  FaUser, FaBullhorn, FaCreditCard, FaHistory, FaUsers, FaClipboardList, FaGift
} from 'react-icons/fa';


const DashboardLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const role = user?.role;

  const getNavigation = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Profile', href: 'profile', icon: FaUser },
          { name: 'Manage Members', href: 'manage-members', icon: FaUsers },
          { name: 'Agreement Requests', href: 'agreement-requests', icon: FaClipboardList },
          { name: 'Make Announcement', href: 'make-announcement', icon: FaBullhorn },
          { name: 'Manage Coupons', href: 'manage-coupons', icon: FaGift },
        ];
      case 'member':
        return [
          { name: 'Profile', href: 'profile', icon: FaUser },
          { name: 'Make Payment', href: 'make-payment', icon: FaCreditCard },
          { name: 'Payment History', href: 'payment-history', icon: FaHistory },
          { name: 'Announcements', href: 'announcements', icon: FaBullhorn },
        ];
      case 'user':
        return [
          { name: 'Profile', href: 'profile', icon: FaUser },
          { name: 'Announcements', href: 'announcements', icon: FaBullhorn },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-indigo-600">
                  {role ? `${role[0].toUpperCase()}${role.slice(1)} Dashboard` : 'User Dashboard'}
                </h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname.includes(item.href)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${
                        location.pathname.includes(item.href)
                          ? 'text-indigo-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={user?.photoURL || 'https://via.placeholder.com/150'}
                  alt="User"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.displayName || 'User'}</p>
                  <p className="text-xs font-medium text-gray-500">View profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
