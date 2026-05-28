import { Link, useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ProgressBar";
import OzzyConversation from "./components/OzzyConversation";
import OzzyDefaultAnimation from "./lotties/OzzyDefaultAnimation.json"
import Input from "../../components/Input/Input";
import Button from "../../components/Button";
import { useState } from "react";
import UserIcon from "../../assets/icons/UserIcon.svg"
import MailIcon from "../../assets/icons/MailIcon.svg"
import PasswordIcon from "../../assets/icons/PasswordIcon.svg"
import VisibilityControlIcon from "../../components/Input/lotties/passwordVisibility.json"
import {useForm} from 'react-hook-form'
import { useLoading } from "../../hooks/useLoading";
import HeaderInitialPage from "../InitialPage/components/HeaderInitialPage";
import { authService } from "../../services/authService";

interface RegisterFormValues {
    username: string; 
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export default function RegisterPage() {
    const [stage, setStage] = useState(0)
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    
    
    const {
        register, 
        handleSubmit,
        watch,
        trigger,
        formState: {errors},
    } = useForm<RegisterFormValues>()

    const username = watch("username");
    const password = watch("password");

    const handleNextStage = async () => {
        // O trigger testa apenas o campo "username". Se passar, ele retorna true.
        const isStepValid = await trigger("username"); 
        if (isStepValid) {
            setStage(1);
        }
    };
    const handlePreviousStage = () => {
        setStage(0);
    };

    const onSubmitFinal = async (data: RegisterFormValues) => {
        try {
            showLoading();
            
            // Enviamos para a API. Note que não mandamos o passwordConfirm para o backend
            await authService.register({
                name: data.name,
                email: data.email,
                username: data.username,
                password: data.password
            });

            // Se deu sucesso, redirecionamos para o Login (ou tela de aviso)
            // passando uma mensagem de sucesso no estado da rota
            navigate('/entrar', { 
                state: { message: "Registro feito com sucesso! Verifique seu e-mail para ativar a conta." }
            });

        } catch (error: any) {
            // O interceptor do axios repassa os erros do NestJS (ex: 409 Conflict)
            const errorMessage = error.response?.data?.message || "Ocorreu um erro ao criar a conta.";
            alert(errorMessage); // Substitua por um Toast se tiver um no projeto!
        } finally {
            hideLoading();
        }
    };
    

    return (
        <div className="mx-6 sm:mx-16 my-6 xl:mx-auto xl:max-w-6xl">
            <header>
                <HeaderInitialPage isRegister={true}/>
            </header>
            
            <form onSubmit={handleSubmit(onSubmitFinal)}>
                {stage === 0 && (
                    <div className="flex flex-col gap-8"> 
                        <Link to="/"><span className="text-[#5B5DF0] text-5xl font-bold">&lt;</span></Link>
                        <div className="w-full text-end">
                            <span className="">Etapa 1/2</span>
                            <ProgressBar progress="1/2" />
                        </div>
                        
                        <OzzyConversation text="Olá, eu sou o Ozzy! Vamos embarcar juntos nessa aventura! Mas antes, preciso conhecer você." animationDataJson={OzzyDefaultAnimation}></OzzyConversation>
                        <p className="text-center">Antes de começarmos, qual será o seu Apelido na nossa aventura?</p>
                        
                        <div className="text-center">
                            <Input 
                                placeHolder="Digite Seu Apelido" 
                                icon={UserIcon} 
                                type="text" 
                                {...register("username", { required: "Apelido é Obrigatório" })}
                            />
                            {errors.username?.message && (
                                <p className="text-red-500 text-sm mt-1">
                                    {String(errors.username.message)}
                                </p>
                            )}
                        
                            {/* Etapa 1: type="button" para NÃO enviar o form ainda */}
                            <Button onClick={handleNextStage} className="mt-5" size="sm" variant="primary" type="button">
                                CONTINUAR
                            </Button>
                        </div>
                    </div>
                )}

                {stage === 1 && (
                    <div className="flex flex-col gap-8"> 
                        <Button onClick={handlePreviousStage} variant="secondary" type="button" className="w-fit p-0 border-none bg-transparent hover:bg-transparent">
                            <span className="text-[#5B5DF0] text-5xl font-bold">&lt;</span>
                        </Button>
                        <div className="w-full text-end">
                            <span className="">Etapa 2/2</span>
                            <ProgressBar progress="1" />
                        </div>
                        
                        <OzzyConversation text={`Legal, ${username}! Agora, me diga como podemos manter sua conta segura.`} animationDataJson={OzzyDefaultAnimation}></OzzyConversation>
                        <p className="text-center">Digite seu Nome Completo, E-mail (Ou do responsável) e escolha uma senha.</p>
                        
                        <div className="flex flex-col gap-4">
                            <Input placeHolder="Digite Seu Nome Completo" icon={UserIcon} type="text" {...register("name", { required: "Nome é Obrigatório" })} />
                            {errors.name?.message && <p className="text-red-500 text-sm text-center font-bold">{String(errors.name.message)}</p>}
                            
                            <Input placeHolder="Digite Seu Email (Ou do responsável)" icon={MailIcon} type="email" {...register("email", { required: "Email é Obrigatório" })} />
                            {errors.email?.message && <p className="text-red-500 text-sm text-center font-bold">{String(errors.email.message)}</p>}
                            
                            <Input isPassword={true} placeHolder="Digite sua Senha" icon={PasswordIcon} animationDataJson={VisibilityControlIcon} type="password" {...register("password", { required: "Senha é Obrigatória", minLength: { value: 6, message: "A senha deve ter no mínimo 6 caracteres" } })} />
                            {errors.password?.message && <p className="text-red-500 text-sm text-center font-bold">{String(errors.password.message)}</p>}
                            
                            {/* 4. Validação dinâmica de confirmação de senha! */}
                            <Input 
                                isPassword={true} 
                                placeHolder="Digite sua Senha Novamente" 
                                icon={PasswordIcon} 
                                animationDataJson={VisibilityControlIcon} 
                                type="password" 
                                {...register("passwordConfirm", { 
                                    required: "Confirmação de senha obrigatória",
                                    validate: (value) => value === password || "As senhas não coincidem"
                                })}  
                            />
                            {errors.passwordConfirm?.message && <p className="text-red-500 text-sm text-center font-bold">{String(errors.passwordConfirm.message)}</p>}
                            
                            <div className="flex justify-between mt-4">
                                <Button onClick={handlePreviousStage} size="sm" variant="secondary" type="button">VOLTAR</Button>
                                {/* Etapa 2: type="submit" agora dispara o handleSubmit do form */}
                                <Button size="sm" variant="primary" type="submit">CONCLUIR</Button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}   