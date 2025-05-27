import { FaUser, FaBullhorn } from 'react-icons/fa';
import DashboardLayout from '../../layouts/DashboardLayout';

const userNavigation = [
  { name: 'My Profile', href: 'profile', icon: FaUser },
  { name: 'Announcements', href: 'announcements', icon: FaBullhorn },
];

const UserDashboard = () => {
  return <DashboardLayout role="user" navigation={userNavigation} />;
};

export default UserDashboard;