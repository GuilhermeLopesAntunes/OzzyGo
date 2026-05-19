import React, { useState } from 'react';
import Home from "../assets/icons/HomePage.svg"
import Store from "../assets/icons/StorePage.svg"
import Rank from "../assets/icons/RankPage.svg"
import Profile from "../assets/icons/ProfilePage.svg"
import {useNavigate} from 'react-router-dom';

type TabType = 'home' | 'store' | 'rank' | 'profile';

const BottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const navigate = useNavigate();


  const getButtonClass = (tabName: TabType) => {
    const isActive = activeTab === tabName;
    return `flex flex-col items-center justify-center w-full gap-1 cursor-pointer transition-colors duration-200 ${
      isActive ? 'text-blue-500' : 'text-gray-400'
    }`;
  };

  const navLinks = (tabName: TabType) => {
    if(tabName === 'home'){
        navigate("/pagina-inicial");
    } else if(tabName === 'store') {
        navigate("/loja");
    }else if(tabName === 'rank') {
        navigate("/classificacao");
    }else if(tabName === 'profile') {
        navigate("/perfil");
    }
  }

  return (
    <nav className=" fixed bottom-0 left-0 w-full h-[80px] bg-white flex justify-around items-center shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      
      <button onClick={()=>{setActiveTab('home'); navLinks('home')}} className={getButtonClass('home')}>
       
        <img src={Home}  alt="Início" className="w-8 h-8" />
        <span className="text-[11px] font-medium">Início</span>
      </button>

      <button onClick={() => {setActiveTab('store'); navLinks('store')}} className={getButtonClass('store')}>
        
        <img src={Store} alt="Loja" className="w-8 h-8" />
        <span className="text-[11px] font-medium">Loja</span>
      </button>

      <button onClick={() => {setActiveTab('rank'); navLinks('rank')}} className={getButtonClass('rank')}>
       
        <img src={Rank} alt="Rank" className="w-8 h-8" />
        <span className="text-[11px] font-medium">Rank</span>
      </button>

      <button onClick={() => {setActiveTab('profile'); navLinks('profile')}} className={getButtonClass('profile')}>
      
        <img src={Profile} alt="Perfil" className="w-8 h-8" />
        <span className="text-[11px] font-medium">Perfil</span>
      </button>

    </nav>
  );
};

export default BottomNav;