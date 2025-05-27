import DashboardLayout from '../../layouts/DashboardLayout';
import { FaUser, FaMoneyBillWave, FaHistory, FaBullhorn } from 'react-icons/fa';

const memberNavigation = [
  { name: 'My Profile', href: 'profile', icon: FaUser },
  { name: 'Make Payment', href: 'make-payment', icon: FaMoneyBillWave },
  { name: 'Payment History', href: 'payment-history', icon: FaHistory },
  { name: 'Announcements', href: 'announcements', icon: FaBullhorn },
];

const MemberDashboard = () => {
  return <DashboardLayout role="member" navigation={memberNavigation} />;
};

export default MemberDashboard;