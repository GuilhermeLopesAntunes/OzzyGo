import React from 'react';
import profileCharacter from "../../../public/itemsStore/boy.png";
import { LevelProgress } from "../../components/LevelProgress";
import { useAuth } from '../../hooks/useAuth'; 

import RubyIcon from '../../assets/icons/Ruby.svg';
import TrophyIcon from '../../assets/icons/Trophy.svg';

export default function ProfilePage() {
    const { user, studentProfile } = useAuth();

    const currentLevel = studentProfile?.level ?? 1;
    const maxXp = currentLevel * 10; 
    const currentXp = studentProfile?.currentXp ?? 0;

    return (

        <div className="max-w-5xl mx-auto p-4 sm:p-8 mt-10 mb-20 font-sans">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
              
                <div className="lg:col-span-1 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 flex flex-col items-center relative overflow-hidden">
                    
                   
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#5B5DF0]/5 rounded-full blur-3xl pointer-events-none"></div>

                
                    <div className="relative mt-2">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-50 rounded-full border-4 border-gray-100 shadow-sm flex justify-center items-center overflow-hidden">
                            <img className="w-full h-full object-contain p-2" src={profileCharacter} alt="Avatar" />
                        </div>
                        
    
                        <button className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 bg-white p-2.5 rounded-full shadow-md border border-gray-100 hover:bg-indigo-50 text-[#5B5DF0] transition-colors" aria-label="Editar foto">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.158 3.712 3.712 1.157-1.158a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                            </svg>
                        </button>
                    </div>

          
                    <div className="text-center mt-6 w-full">
                        <h2 className="text-2xl font-bold text-gray-900">{user?.name || "Aventureiro"}</h2>
                        
      
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <p className="text-gray-500 font-medium text-lg">@{user?.username || "ozzyplayer"}</p>
                            <button className="text-gray-400 hover:text-[#5B5DF0] transition" aria-label="Editar apelido">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.89 1.113l-3.178.106.106-3.178a4.5 4.5 0 011.113-1.89l6.678-6.678z" />
                                </svg>
                            </button>
                        </div>

                 
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full">
                            <span className="text-[#5B5DF0] font-bold text-sm uppercase tracking-wider">Explorador Iniciante</span>
                        </div>
                    </div>
                </div>

           
                <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-8">
                    

                    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
                        <LevelProgress currentXp={currentXp} maxXp={maxXp} level={currentLevel} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        

                        <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-5 sm:p-6 flex items-center gap-4 sm:gap-5 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#EDFFEB] to-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <img src={RubyIcon} alt="Rubys" className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-0.5">Rubys</p>
                                <p className="text-2xl sm:text-3xl font-black text-gray-800">{studentProfile?.ruby ?? 0}</p>
                            </div>
                        </div>


                        <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-5 sm:p-6 flex items-center gap-4 sm:gap-5 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FFF9E5] to-yellow-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <img src={TrophyIcon} alt="Troféus" className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-0.5">Troféus</p>
                                <p className="text-2xl sm:text-3xl font-black text-gray-800">{studentProfile?.trophy ?? 0}</p>
                            </div>
                        </div>
                    </div>

           
                    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Baú de Conquistas</h3>
                            <button className="text-sm text-[#5B5DF0] font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl transition">Ver todas</button>
                        </div>
                        
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
                        
                            <div title="Primeira Missão Concluída" className="aspect-square bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-center flex-col gap-1 transform hover:scale-105 transition cursor-pointer">
                                <span className="text-2xl sm:text-3xl drop-shadow-sm">🌟</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-[#5B5DF0] uppercase">Novato</span>
                            </div>
                            
                    
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center flex-col gap-2 opacity-60">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                    <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase">Oculto</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}