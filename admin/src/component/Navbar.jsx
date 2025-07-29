import React from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const {dToken,setDToken}=useContext(DoctorContext)
  const navigate = useNavigate();

  const logout = () => {
    if (aToken || dToken) {
      setAToken('');
      setDToken('')
      localStorage.removeItem('dToken')
      localStorage.removeItem('aToken');
      navigate('/login'); // Redirect after logout if needed
    }
    
  };

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-44 h-12 cursor-pointer' src={assets.logo} alt="" />
        <p className='text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium'>
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>
      <button
        onClick={logout}
        className='item-center gap-2 bg-primary hover:bg-blue-600 px-8 py-3 rounded-full text-white text-sm md:mt-7 hover:scale-105 transition-all duration-300'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
