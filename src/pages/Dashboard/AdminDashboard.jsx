import DashboardLayout from '../../layouts/DashboardLayout';
import {
  FaUser,
  FaUsers,
  FaBullhorn,
  FaFileContract,
  FaTags,
} from 'react-icons/fa';

const adminNavigation = [
  { name: 'Admin Profile', href: 'profile', icon: FaUser },
  { name: 'Manage Members', href: 'manage-members', icon: FaUsers },
  { name: 'Make Announcement', href: 'make-announcement', icon: FaBullhorn },
  { name: 'Agreement Requests', href: 'agreement-requests', icon: FaFileContract },
  { name: 'Manage Coupons', href: 'manage-coupons', icon: FaTags },
];

const AdminDashboard = () => {
  return <DashboardLayout role="admin" navigation={adminNavigation} />;
};

export default AdminDashboard;