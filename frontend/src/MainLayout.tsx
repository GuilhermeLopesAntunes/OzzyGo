import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import HeaderHomePage from './features/HomePage/components/HeaderHomePage';
import { useAuth } from './hooks/useAuth'; 
import { studentService } from './services/studentService';
import { useLoading } from './hooks/useLoading';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingInfo, setIsCheckingInfo] = useState(true);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    async function verifyFirstAccess() {
      if (user?.role !== 'student') {
        setIsCheckingInfo(false);
        return;
      }

      try {
        showLoading()
        await studentService.getProfile();
        setIsCheckingInfo(false); 
      } catch (error: any) {

        if (error.response?.status === 404) {
          navigate('/onboarding'); 
        } else {
    
          setIsCheckingInfo(false);
        }
      } finally {
        hideLoading()
      }
    }

    verifyFirstAccess();
  }, [user, navigate]);

  if (isCheckingInfo) {
    return null
  }


  return (
    <div className="flex flex-col min-h-screen mx-6 sm:mx-16 my-6 xl:mx-auto xl:max-w-6xl">
      <HeaderHomePage />
      <main className="grow pb-20]">
        <Outlet /> 
      </main>

      <BottomNav />
    </div>
  );
};

export default MainLayout;