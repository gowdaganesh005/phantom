import './App.css'
import { Login } from './Pages/Login'
import { BrowserRouter ,Routes,Route } from 'react-router-dom'
import ProtectedRoute from './Pages/ProtectedRoute'
import Dashboard from './Pages/Dashboard'
import { Summary } from './Pages/Summary'
import { Navbar } from './Pages/Navbar'
import { AddMeetingLink } from './Pages/AddMeeting'
import LandingPage from './Pages/Landing'

function App() {
  

  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <div className='bg-black w-full min-h-screen'>
      
        <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
            <Route path="/summary" element={<Summary/>} />
            <Route path='/addMeetLink' element={<AddMeetingLink/>}/>
            
        </Routes>
        </div>
      </BrowserRouter>
      
    </>
  )
}

export default App
