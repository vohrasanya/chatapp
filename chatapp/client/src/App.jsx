import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage'
import Profilepage from './pages/Profilepage'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'

const App = () => {
  const {authUser} = useContext(AuthContext);
  return (
    <div className= "bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster/>
      <Routes>
        <Route path='/' element ={ authUser ? <Homepage/>:<Navigate to="/login" />}/>
        <Route path='/login' element ={!authUser ? <Loginpage/> : <Navigate to="/"/>}/>
        <Route path='/profile' element ={authUser ? <Profilepage/> : <Navigate to="/login"/> }/>
      </Routes>
    </div>
  )
}

export default App