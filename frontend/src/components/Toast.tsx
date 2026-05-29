import React, { useEffect, useState } from 'react';
import sucessIcon from '../assets/icons/sucessIcon.svg';
import errorIcon from '../assets/icons/errorIcon.svg';
import infoIcon from '../assets/icons/infoIcon.png';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  title: string;
  description?: string;
  onClose: () => void;
}

const toastStyles = {
  success: {
    containerClass: 'bg-[#EDFFEB] border-[#26BF1B]',
    icon: sucessIcon,
  },
  error: {
    containerClass: 'bg-[#FFF0F0] border-[#BF1B1B]',
    icon: errorIcon,
  },
  info: {
    containerClass: 'bg-[#F0F8FF] border-[#1BA4BF]',
    icon: infoIcon,
  },
};

export function Toast({ type, title, description, onClose }: ToastProps) {
  const { containerClass, icon } = toastStyles[type];
  

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {

    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);


    const exitTimer = setTimeout(() => {
      handleClose();
    }, 3000);


    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, []);


  const handleClose = () => {
    setIsVisible(false);
    

    setTimeout(() => {
      onClose(); 
    }, 300);
  };

  return (
    <div 
      className={`
        relative flex gap-4 p-6 border-l-[8px] rounded-r-md shadow-md w-full max-w-[90vw] sm:max-w-md 
        ${containerClass}
        
        /* CLASSES DE ANIMAÇÃO AQUI */
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}
      `}
    >
      

      <button 
        onClick={handleClose}
        className="absolute top-2 right-4 text-gray-400 hover:text-gray-800 font-bold"
        aria-label="Fechar notificação"
      >
        X
      </button>

      <img src={icon} alt={`${type} icon`} className="w-8 h-8 flex-shrink-0 mt-1" />
      
      <div className="flex-1 min-w-0">
        <p className="font-bold text-xl mb-1 text-gray-900 pr-6 truncate">{title}</p>
        {description && (
          <p className="text-gray-700 break-words whitespace-normal leading-relaxed">
            {description}
          </p>
        )}
      </div>
    
    </div>
  );
}