import Logo from "../../../assets/ozzyLogo.svg"
import { Link } from "react-router-dom"
import Ruby from "../../../assets/icons/Ruby.svg"
import Trophy from "../../../assets/icons/Trophy.svg"
import Button from "../../../components/Button"
import { useAuth } from "../../../contexts/AuthContext"

export interface props {
    isRegister: boolean
}
export default function HeaderHomePage() {
    const { signOut } = useAuth();
    return (
        <nav className="flex justify-between border-b  border-[#e2e2e2]">
            <Link to="/pagina-inicial"><img className="pb-2  sm:w-25 xl:w-32" src= {Logo} alt="Ozzy voando em um disco voador" /></Link>
            <div className="flex gap-5 items-center">
                <div className="flex items-center gap-2">
                    <img className="w-5 sm:w-7 xl:w-8" src={Ruby} alt="Moedas do jogo" />
                    <span className="text-[#DF6464] font-bold">120</span>
                </div>
                <div className="flex items-center gap-2">
                    <img className="w-8 sm:w-10 xl:w-10" src={Trophy} alt="Conquistas do jogo" />
                    <span className="text-[#FFCB1E] font-bold">10</span>
                   
                </div>
                <Button onClick={signOut} type="button" variant="secondary">Sair</Button>
            </div>
        </nav>
    )
}