import CardItem from "./components/CardItem"

import BoyOne from "/public/itemsStore/boy.png"
import BoyTwo from "/public/itemsStore/boy2.png"
import Robot from "/public/itemsStore/robot.png"
import { useState } from "react"



const dataStore = [
    {
        id: 1,
        icon: BoyOne,
        type: {
            name: "Comum",
            color: "#B2B2B2",
            bgColor: "#FFFFFF",
            value: 50
        },
        nameItem: "Garoto Básico",
        isSkin: true,
        descriptionItem: "Item básico de perfil",
        
    },
    {
        id: 2,
        icon: BoyTwo,
        nameItem: "Garoto Básico 2",
        type: {
            name: "Raro",
            color: "#0070DD",
            bgColor: "#AAC8E6",
            value: 100
        },
        isSkin: true,
        descriptionItem: "Item básico de perfil 2",
        value: 120
    },
    {
        id: 3,
        icon: Robot,
        nameItem: "Robô",
        type: {
            name: "Épico",
            color: "#A335EE",
            bgColor: "#DBC0ED",
            value: 150
        },
        isSkin: true,
        descriptionItem: "Item de Robô Épico",
    },
    {
        id: 4,
        icon: Robot,
        nameItem: "Robô",
        isSkin: true,
        type: {
            name: "Lendário",
            color: "#F58B25",
            bgColor: "#FFDFC0",
            value: 200
        },
        descriptionItem: "Item de Robô Lendário",
       
    },
    {
        id: 5,
        icon: Robot,
        nameItem: "Robô",
        isSkin: true,
        type: {
            name: "Mítico",
            color: "#E60000",
            bgColor: "#FFC3C3",
            value: 250
        },
        descriptionItem: "Item de Robô Épico",
        
    },
    {
        id: 6,
        icon: "Ninguém me para",
        nameItem: "Robô",
        isSkin: false,
        type: {
            name: "Mítico",
            color: "#E60000",
            bgColor: "#FFC3C3",
            value: 250
        },
        
        descriptionItem: "Título ",
        value: 200
    }
]

type statesPage = "title" | "skins"

export default function StorePage() {
    const [page, setPage] = useState<statesPage>("skins")
    const filteredItems = dataStore.filter((item) => {
        if (page === "skins") return item.isSkin === true;
        if (page === "title") return item.isSkin === false;
        return false;
    });
    return(
        <main>
            <div className="w-full m-auto text-center mb-6">
        
                <button 
                    onClick={() => setPage("skins")}
                    className={`mr-5 ${page === "skins" ? "text-[#5B5DF0] underline font-bold" : ""}`}
                >
                    Perfil
                </button>
                <button 
                    onClick={() => setPage("title")}
                    className={`mr-5 ${page === "title" ? "text-[#5B5DF0] underline font-bold" : ""}`}
                >
                    Títulos
                </button>
            </div>
            

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
    
                {filteredItems.map((item) => (
                    <CardItem 
                        key={item.id} 
                        isSkin={item.isSkin} 
                        colorType={item.type.color} 
                        bgColorType={item.type.bgColor} 
                        type={item.type.name} 
                        descriptionItem={item.descriptionItem} 
                        nameItem={item.nameItem} 
                        value={item.type.value} 
                        icon={item.icon} 
                    />
                ))}
            </div>
        </main  >
    )
}