import Ruby from "../../../assets/icons/Ruby.svg"

interface props {
    icon?: string,
    nameItem: string,
    descriptionItem: string,
    value: number
    type: string,
    colorType: string,
    bgColorType?: string
    isSkin: boolean

}
export default function CardItem({icon, nameItem, descriptionItem, value, colorType, bgColorType, type, isSkin}: props){
    return(
        <div className="bg-[#f5f5f5] px-4 py-5 flex flex-col items-center rounded-3xl">
            <div>
                {isSkin ? (<img src={icon} className="" alt="Icone da loja" />) : (<span>{icon}</span>)}
            </div>
            <div className="flex flex-col self-auto w-full">
                <span className="font-bold text-xl">{nameItem}</span>
                <span className="text-sm">{descriptionItem}</span>
                <div className="my-2 w-fit flex items-center gap-2 px-2 rounded-4xl"
                    style={{ backgroundColor: bgColorType }}
                >
                    <div className="w-3 h-3 rounded-3xl"
                        style={{ backgroundColor: colorType }}
                    ></div>
                    <span className= "font-bold"
                        style={{ color: colorType }}
                    >{type}</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <img src={Ruby} alt="" />
                        <span className={`text-[#DF6464] font-bold`}>{value}</span>
                        
                    </div>
                    <button className="bg-[#DF6464] text-white px-3 py-2 rounded-3xl">
                            Comprar
                    </button>
                </div>
                    
            </div>
        </div>
    )
}