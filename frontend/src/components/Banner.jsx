import React  from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router'
import { AppContext } from '../context/AppContext'
import { useState, useContext } from 'react'

const Banner = () => {
  const navigate=useNavigate()
  const {token, setToken} = useContext(AppContext)
  return (
  
        <div>
        <div className="bg-white items-center text-center   p-6 md:p-8 my-10 max-w-6xl mx-auto flex flex-col gap-6 relative">
          <img src={assets.docbanner} className="bg-white items-center text-center border border-gray-200 shadow-lg rounded-2xl  my-10 max-w-6xl mx-auto flex flex-col gap-6 object-cover" alt="" />
      <div className="w-full md:w-[40rem] flex flex-col items-center absolute top-0  h-full justify-center">
        <h2 className="text-2xl  md:text-3xl font-bold text-gray-800 mb-2">
          Your Health Deserves Trusted Experts
        </h2>
        <p className="text-gray-600 text-base md:text-lg mb-4">
          Join thousands of patients who rely on DocTime for easy booking, verified doctors, and personal health tracking. It’s fast, secure, and free to get started.
        </p>
        { token ?
        <button onClick={()=>navigate('/doctors')} className="bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
            Get Appointment
          </button>:

         <button onClick={()=>navigate('/Login')} className="bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
            Create Your Free Account
          </button>
        }
          
        
      </div>

    </div>
      
    </div>
  )
}

export default Banner