import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';


const DashboardRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    
    if (user?.role === 'admin') {
      navigate('/dashboard/admin');
    } else if (user?.role === 'member') {
      navigate('/dashboard/member');
    } else {
      navigate('/dashboard/user');
    }
  }, [user, navigate]);

  return null; 
};

export default DashboardRedirect;