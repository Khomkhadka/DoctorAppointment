import React from 'react'
import { Route,Routes } from 'react-router'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import Contact from './pages/Contact'
import About from './pages/About'
import MyProfile from './pages/MyProfile/'
import MyAppointment from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EsewaPay from './pages/EsewaPay'
import PaymentSuccess from './pages/PaymentSuccess'
import ChatBox from './components/ChatBox'


const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%] '>
      <ToastContainer/>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/myprofile' element={<MyProfile />} />
        <Route path='/myappointment' element={<MyAppointment />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/esewaPay' element={<EsewaPay />} />
       <Route path="/payment-success" element={<PaymentSuccess />} />
       
      </Routes>

      <ChatBox className='relative bottom-6 right-6 w-[360px] max-h-[80vh] bg-white rounded-xl shadow-xl border flex flex-col z-50'/>
      <Footer/>
    </div>
  )
}

export default App