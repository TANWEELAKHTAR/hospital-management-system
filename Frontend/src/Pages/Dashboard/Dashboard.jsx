import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Dashboard = () => {
  const { userRole, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        navigate('/login');
        return;
      }

      // Redirect based on user role
      switch (userRole) {
        case 'reception':
          navigate('/reception');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'nurse':
          navigate('/nurse');
          break;
        case 'lab':
          navigate('/lab');
          break;
        case 'clinicAdmin':
          navigate('/reception'); // Admin can see all, default to reception
          break;
        default:
          navigate('/unauthorized');
      }
    }
  }, [userRole, isLoggedIn, loading, navigate]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D8E83] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Redirecting to your dashboard...</h2>
      </div>
    </div>
  );
};

export default Dashboard;
