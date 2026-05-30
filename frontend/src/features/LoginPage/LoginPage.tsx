import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useLoading } from "../../hooks/useLoading";
import { useAuth } from "../../hooks/useAuth";

import OzzyConversation from "../Register/components/OzzyConversation"; 
import OzzyDefaultAnimation from "../Register/lotties/OzzyDefaultAnimation.json";
import Input from "../../components/Input/Input";
import Button from "../../components/Button";
import HeaderInitialPage from "../InitialPage/components/HeaderInitialPage";
import VisibilityControlIcon from "../../components/Input/lotties/passwordVisibility.json";

import UserIcon from "../../assets/icons/UserIcon.svg";
import PasswordIcon from "../../assets/icons/PasswordIcon.svg";
import { useToast } from "../../hooks/useToast";

// A tipagem reflete exatamente o que o seu NestJS espera no LoginDto
interface LoginFormValues {
    username: string;
    password: string;
}

export default function LoginPage() {
    const { showLoading, hideLoading } = useLoading();
    const { signIn } = useAuth(); 
    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = location.state?.message;
    const {addToast} = useToast()

    const {
        register, 
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>();

    const onSubmit = async (data: LoginFormValues) => {
        try {
            showLoading();
            
            await signIn(data); 
            
           
            navigate('/pagina-inicial'); 
            addToast({
                type: 'success',
                title: 'Bem Vindo!',
                description: 'Que bom ver você se divita!',
            });
            
        } catch (error: any) {
            
            const errorMessage = error.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.";
            addToast({
                type: 'error',
                title: 'Erro ao entrar',
                description: errorMessage,
            });
        } finally {
            hideLoading(); 
        }
    };

    return (
        <div className="mx-6 sm:mx-16 my-6 xl:mx-auto xl:max-w-6xl">
            <header>
                <HeaderInitialPage isRegister={false} />
            </header>

            <div className="flex flex-col gap-8 mt-8"> 
               
                <Link to="/">
                    <span className="text-[#5B5DF0] text-5xl font-bold">&lt;</span>
                </Link>

               
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center font-bold">
                        {successMessage}
                    </div>
                )}
                
                <OzzyConversation 
                    text="Bem-vindo de volta! Senti sua falta. Pronto para mais uma aventura?" 
                    animationDataJson={OzzyDefaultAnimation}
                />
                
                <p className="text-center">Insira seu Apelido e Senha para continuar.</p>
                
                <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <Input 
                        placeHolder="Digite Seu Apelido" 
                        icon={UserIcon} 
                        type="text" 
                        {...register("username", { required: "O Apelido é obrigatório" })} 
                    />
                    {errors.username?.message && (
                        <p className="text-red-500 text-sm text-center font-bold">
                            {String(errors.username.message)}
                        </p>
                    )}
                    
                    <Input 
                        isPassword={true} 
                        placeHolder="Digite sua Senha" 
                        icon={PasswordIcon} 
                        animationDataJson={VisibilityControlIcon} 
                        type="password" 
                        {...register("password", { required: "A Senha é obrigatória" })} 
                    />
                    {errors.password?.message && (
                        <p className="text-red-500 text-sm text-center font-bold">
                            {String(errors.password.message)}
                        </p>
                    )}
                    
                    <div className="flex flex-col items-center gap-4 mt-6">
                        <Button className="w-full sm:w-auto" size="lg" variant="primary" type="submit">
                            ENTRAR
                        </Button>
                        
                        <div className="text-sm mt-4 text-center">
                            <span className="text-gray-600">Ainda não tem uma conta? </span>
                            <Link to="/registro" className="text-[#5B5DF0] font-bold hover:underline">
                                Cadastre-se aqui
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}