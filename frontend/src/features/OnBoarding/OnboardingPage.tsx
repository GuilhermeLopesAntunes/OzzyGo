import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService'; 
import { professorService } from '../../services/professorService'; 
import { useAuth } from '../../contexts/AuthContext'; 
import { useLoading } from '../../hooks/useLoading'; 
import Button from '../../components/Button';
import ozzyGoLogo from "../../assets/ozzyLogo.svg"
// Se tiver o componente do Ozzy Lottie, importe aqui! Ex: import OzzyAnimation from '../components/OzzyAnimation';

export function OnboardingPage() {
  const [code, setCode] = useState('');
  const [isProfessorMode, setIsProfessorMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { refreshSession, signOut } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!code.trim()) {
      setErrorMessage('Por favor, insira um código.');
      return;
    }

    try {
      showLoading();

      if (isProfessorMode) {
   
        await professorService.promoteToProfessor(code);
        await refreshSession(); 
        navigate('/pagina-inicial'); 
      } else {
 
        await studentService.joinClassroom(code);
        navigate('/pagina-inicial'); 
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Código inválido ou não encontrado.'
      );
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
      {/* Aqui entraria a animação do Ozzy! */}
      <img src={ozzyGoLogo} width={180} className='mb-20' alt="Logo do sistema" />

      <h1 className="text-2xl font-bold mb-2">
        {isProfessorMode ? 'Acesso de Professor' : 'Bem-vindo ao OzzyGo!'}
      </h1>
      <p className="mb-8 text-gray-600">
        {isProfessorMode
          ? 'Insira o código secreto fornecido pela administração.'
          : 'Para começar sua jornada, insira o código da sua turma.'}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
        <input
          type="text"
          placeholder="Ex: A7X9K2"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full px-4 py-3 mb-4 text-center uppercase border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
        />

        {errorMessage && (
          <p className="mb-4 text-sm font-semibold text-red-500">{errorMessage}</p>
        )}

    
        <Button className='w-80' type='submit' variant='primary'>{isProfessorMode ? 'Validar Código' : 'Entrar na Turma'}</Button>
      </form>
        <div className="mt-3">
        <Button
            className='w-80' 
            type="button" 
            variant="secondary" 
            onClick={signOut} 
        >
            Sair da conta
        </Button>
      </div>

      <button
        type="button"
        onClick={() => {
          setIsProfessorMode(!isProfessorMode);
          setCode('');
          setErrorMessage('');
        }}
        className="mt-8 text-sm font-semibold text-gray-500 underline hover:text-gray-700"
      >
        {isProfessorMode
          ? 'Voltar para o acesso de aluno'
          : 'Você é um professor? Clique aqui'}
      </button>

      
    </div>
  );
}