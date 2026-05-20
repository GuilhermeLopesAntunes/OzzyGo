import {useLottie} from 'lottie-react';
import mainHomeAnimation from "../lotties/mainHomeAnimation.json"
import Button from '../../../components/Button';
import { Link } from 'react-router-dom';



export default function 
MainCardInformation(){
    const options = {
    animationData: mainHomeAnimation,
    loop: true,
    
    };

    const { View } = useLottie(options);

    return (
    <div className='flex flex-col xl:flex-row items-center justify-center gap-5 xl:justify-between mb-20'>
        <div className='w-80 sm:w-96 xl:w-[400px] flex-shrink-0'>
            {View}
        </div>
        <div>
            <h2 className='text-[#555353] xl:mb-20 mb-8 text-center font-bold text-2xl sm:text-3xl sm:w-150'>Aprender Nunca Foi Tão Divertido! Explore, Jogue e Conquiste Com o Ozzy!</h2>
            <div className='flex flex-col items-center gap-5 xl:flex-row'>
                <Link to="/registro"><Button type='button' variant='primary' size='lg'>INICIAR AVENTURA</Button></Link>
                <Link to="/entrar"><Button type='button' variant='secondary' size='lg'>JÁ POSSUO CONTA</Button></Link>
            </div>
        </div>
        
        
        
    </div> 
    )
}