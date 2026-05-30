import React from 'react';

import EnergyIcon from '../assets/icons/energyIcon.svg'
import TreasureChest from '../assets/icons/TreasureChest.svg';
import ProgressBar from './ProgressBar';

interface LevelProgressProps {
  currentXp: number;
  maxXp: number;
  level: number;
}

export function LevelProgress({ currentXp, maxXp, level }: LevelProgressProps) {
  

  const progressPercentage = Math.min(100, Math.max(0, (currentXp / maxXp) * 100));

  return (
    <div className="flex flex-col flex-1">
      
  
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center">
          <img src={EnergyIcon} alt="Ícone de energia" className="w-6 h-6" /> 
          

          <span className="font-bold text-[#373737]">
            {currentXp}/{maxXp}xp
          </span>
        </div>
        

        <span className="font-bold text-[#373737]">
          Nível {level}
        </span>
      </div>


      <div className="flex items-center gap-5 mt-2">
        <div className="flex-1">
     
          <ProgressBar progress={`${progressPercentage}%`} />
        </div>
        <img src={TreasureChest} alt="Baú de tesouro" className="w-8 h-8 flex-shrink-0" />
      </div>
      
    </div>
  );
}