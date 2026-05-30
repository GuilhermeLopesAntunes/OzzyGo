import { LevelProgress } from "../../../components/LevelProgress";

export default function CardUser() {
  return (
    <div className="w-full flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm mb-5">
      
      <div className="w-20 h-20 flex-shrink-0 bg-amber-700 rounded-full"></div>

  
      <div className="flex flex-col flex-1">
        <span className="font-bold text-lg text-[#373737]">Nome do Aluno</span>
        <span className="text-gray-500">Título</span>
        <LevelProgress
          currentXp={30}
          maxXp={100}
          level={10}          
          />
        

        
      </div>

    </div>
  );
}