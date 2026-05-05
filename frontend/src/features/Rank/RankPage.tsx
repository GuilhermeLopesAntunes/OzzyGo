import CardUser from "./components/CardUser";
import RankingBar from "./components/RankingSection";

export default function RankingPage() {
  return (
    // Container principal: Ocupa a tela toda (h-screen) ou apenas a largura (w-full)
    <div className="w-full flex flex-col items-center mt-2">
      
      {/* Container do Pódio: Ocupa 100% da largura e distribui as barras */}
      <div className="w-full flex items-end justify-between px-4 mb-8">
        
        {/* 2º Lugar */}
        <RankingBar height={100} position={2} showUser={true} />

        {/* 1º Lugar (Geralmente maior e mais centralizado) */}
        <div className="pb-4"> {/* Pequeno offset para destacar o vencedor */}
            <RankingBar height={150} position={1} showUser={true} />
        </div>

        {/* 3º Lugar */}
        <RankingBar height={80} position={3} showUser={true} />
        
      </div>

      {/* Card do Usuário: Ocupa a largura toda com margem automática */}
      <div className="w-full">
        <CardUser />
        <CardUser />
      </div>
      
    </div>
  );
}