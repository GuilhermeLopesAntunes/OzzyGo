import MainCardInformation from "./components/MainCardInformation";
import CardInformation from "./components/CardInformation";

import SecondMainInformation from "./lotties/SecondMainAnimation.json"
import ThridMainInformation from "./lotties/ThridMainAnimation.json"
import MainHomeAnimation from "./lotties/mainHomeAnimation.json"
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import HeaderInitialPage from "./components/HeaderInitialPage";

 

export default function InitialPage() {
    return(
        <div className="mx-6 sm:mx-16 my-6 xl:mx-auto xl:max-w-6xl">
            <header>
                <HeaderInitialPage isRegister ={false} />
            </header>
            <main className="flex flex-col items-center">
                <MainCardInformation />
                <div className="mb-40"></div>
                <CardInformation reverse = {true} title="Desafios interativos para fixar o conhecimento." text="Aprender nunca foi tão dinâmico! Com nossos desafios interativos, você vai explorar conceitos de maneira prática e divertida. Resolva quizzes, complete missões e teste seus conhecimentos enquanto avança no aprendizado. Aqui, cada resposta certa é um passo a mais para dominar o conteúdo!" animationDataJson={SecondMainInformation} />
                <div className="mb-40"></div>
                <CardInformation reverse = {false} title="Uma experiência gamificada." text="Transforme o aprendizado em um jogo emocionante! Com pontuações, conquistas e níveis, nossa plataforma gamificada mantém você motivado enquanto aprende. Quanto mais você se desafia, mais recompensas ganha — e o conhecimento se torna a maior vitória!" animationDataJson={ThridMainInformation} />
                <div className="mb-40"></div>
                <CardInformation reverse = {true} title="E claro,o Ozzy, seu guia e parceiro nessa aventura!" text="Conheça o Ozzy, o cachorrinho que vai transformar seu aprendizado em uma aventura inesquecível! Sempre pronto para te motivar e te ajudar, o Ozzy é mais do que uma mascote — ele é seu parceiro de jornada. Aprender com ele é muito mais divertido!" animationDataJson={MainHomeAnimation}/>
                <div className="mb-30"></div>
                <Link to="/registro"><Button className="xl:w-150" type="button" size="lg">INICIAR AVENTURA</Button></Link>
                <div className="mb-30"></div>
            </main>
            
        </div>
    )
}