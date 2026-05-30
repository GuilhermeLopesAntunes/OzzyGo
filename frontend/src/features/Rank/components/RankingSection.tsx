
interface props {
    height: number;
    position: number;
    showUser: boolean;
}

export default function RankingBar({ height, position, showUser = false }: props) {
  return (
    <div className="flex flex-col items-center flex-1"> 
      <div className={`mb-2 transition-transform duration-300 ${showUser ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <div className="w-12 h-12 bg-amber-700 rounded-full border-2 border-white shadow-md"></div>
      </div>

      <div 
        className="w-20 lg:w-25 xl:w-30 bg-[#656EC2] border-l-[6px] border-b-0 border-l-[#40478A]  rounded-t-2xl flex flex-col items-center justify-start pt-2"
        style={{ height: `${height}px` }}
      >
        <span className="text-white font-bold text-lg drop-shadow-md">
          {position}º
        </span>
      </div>
    </div>
  );
}