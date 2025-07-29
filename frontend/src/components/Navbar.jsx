import React, { useState,useContext } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router'
import {AppContext} from '../context/AppContext'
const Navbar = () => {
    const navigate = useNavigate()
    const {userData} = useContext(AppContext)
    
    const [showMenu, setShowMenu] = useState(false)
    const {token, setToken}= useContext(AppContext)
    const logout = () =>{
        setToken(false)
        localStorage.removeItem('token')
    }

  return (
    <div className='flex item-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <NavLink to='./'><img className='w-44 h-12 cursor-pointer' src={assets.logo} alt="logo" /></NavLink>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='./'>
                <li className='py-1' >
                    Home
                </li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to='./doctors'>
                <li className='py-1'>
                    Doctors
                </li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to='./about'>
                <li className='py-1'>
                    About
                </li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to='./contact'>
                <li className='py-1'>
                    Contact
                </li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
        </ul>
        <div className="flex item-center gap-4">
            {
                token
                ?<div className='flex item-center gap-2 cursor-pointer group relative'>
                    <img className='w-12 h-12 rounded-full object-cover border-2 border-blue-500'  src={userData.image?userData.image:assets.profileIcon} alt="" />
                    <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                            <p onClick={()=>navigate('myProfile')} className='hover:text-black cursor-pointer'>My Profile</p>
                            <p onClick={()=>navigate('myappointment')} className='hover:text-black cursor-pointer'>My Appointment</p>
                            <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                : <button onClick={()=>navigate('./Login')} className='py-3 bg-primary text-white px-8  rounded-full font-bold hidden md:block'>
                Login/Signup
            </button>
            }
           <img onClick={()=>setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
           {/* for mobile */}
           <div className={`${showMenu ? 'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-0 overflow-hidden bg-white transition-all`}>
            <div className='flex item-center justify-between px-5 py-6'>
                <img className='w-36' src={assets.logo} alt="" />
                <img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
            </div>
            <ul className='flex flex-col item-center gap-2 mt-5 px-5 text-lg font-medium'>
                <NavLink onClick={()=>setShowMenu(false)} to='/'>Home</NavLink>
                <NavLink onClick={()=>setShowMenu(false)} to='/doctors'>Doctors</NavLink>
                <NavLink onClick={()=>setShowMenu(false)}to='/about'>About</NavLink>
                <NavLink onClick={()=>setShowMenu(false)} to='/contact'>Contact</NavLink>
            </ul>
           </div>
        </div>
    </div>
  )
}

export default Navbar