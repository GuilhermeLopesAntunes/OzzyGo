import EnergyIcon from "../../../assets/icons/energyIcon.svg"
import ProgressBar from "../../../components/ProgressBar"
import TreasureChest from "../../../assets/icons/TreasureChest.svg"

export default function CardUser() {
  return (
    <div className="w-full flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm mb-5">
      
      {/* Avatar fixo */}
      <div className="w-20 h-20 flex-shrink-0 bg-amber-700 rounded-full"></div>

      {/* flex-1 aqui é vital: ele força esta div a ocupar todo o resto da largura */}
      <div className="flex flex-col flex-1">
        <span className="font-bold text-lg text-[#373737]">Nome do Aluno</span>
        <span className="text-gray-500">Título</span>
        
        <div className="flex justify-between items-center mt-1">
          <div className="flex gap-2 items-center">
            <img src={EnergyIcon} alt="Icone de energia" className="w-4 h-4" /> 
            <span className="font-bold text-[#373737]">30/100px</span>
          </div>
          <span className="font-bold text-[#373737]">
            Nível 10
          </span>
        </div>

        <div className="flex items-center gap-5 mt-2">
          <div className="flex-1">
            <ProgressBar progress="50%" />
          </div>
          <img src={TreasureChest} alt="Baú de tesouro" className="w-8 h-8 flex-shrink-0" />
        </div>
      </div>

    </div>
  );
}