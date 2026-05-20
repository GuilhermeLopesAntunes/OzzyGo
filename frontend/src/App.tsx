import './App.css'
import { Routes, Route } from 'react-router-dom'

import RegisterPage from './features/Register/RegisterPage'
import InitialPage from './features/InitialPage/InitialPage'
import HomePage from './features/HomePage/HomePage'
import MainLayout from './MainLayout'
import StorePage from './features/Store/StorePage'
import RankPage from './features/Rank/RankPage'
import ProfilePage from './features/Profile/ProfilePage'
import LoginPage from './features/LoginPage/LoginPage'

function App() {
  return (
    <>
      {/* Se precisar de um wrapper global, coloque aqui FORA do <Routes> */}
      <Routes>
        {/* Rotas sem a Bottom Nav */}
        <Route path='/' element={<InitialPage />}/>
        <Route path='/registro' element={<RegisterPage />}/>
        <Route path='/entrar' element={<LoginPage/>}/>
        
        {/* Rotas COM a Bottom Nav (agrupadas no MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path='/pagina-inicial' element={<HomePage />}/>
          <Route path='/loja' element={<StorePage />}/>
          <Route path='/classificacao' element={<RankPage />}/>
          <Route path='/perfil' element={<ProfilePage />}/>
        </Route>
      </Routes>
    </>
  )
}

export default App