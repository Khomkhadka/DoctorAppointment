import React,{useContext} from 'react'
import { AppContext } from '../context/AppContext';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const MyAppointments = () => {
  // const appointmentToken = 1;
  const {backendUrl,token, getDoctorsData} = useContext(AppContext)
  const navigate=useNavigate()

  const [appointments,setAppointments] = useState([])
  const month = ['','JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  
  const getUserAppointments = async ()=>{
       try {
        
           const {data} = await axios.get(backendUrl + '/api/user/appointments',{headers:{token}})
           
           if (data.success) {
            setAppointments(data.appointments.reverse())
            
           }
       } catch (error) {
        console.log(error)
        toast.error(error.message)
       }
  }
  
const slotDateFormat = (slotDate) =>{
  const dateArray = slotDate.split('_')
  return dateArray[0]+ " " + month[Number(dateArray[1])] + " " + dateArray[2]
}

const cancelAppointment = async (appointmentId) =>{
  try {
    
    const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})
    if (data.success) {
      toast.success(data.message)
      getUserAppointments()
      getDoctorsData()
    }else{
       toast.error(data.message)
    }

  } catch (error) {
     console.log(error)
        toast.error(error.message)
  }
}
  useEffect(()=>{
    if (token) {
      getUserAppointments()
    }
  },[token])
  return (
<div className='min-h-screen '>
  
  <p className='pb-3 mt-12 font-medium text-2xl text-zinc-800 border-b border-zinc-300'>My Appointments</p>

<div className='bg-gray-50 rounded-md mt-6 shadow-sm'>
  {appointments.map((item, index) => (
    <div
      className='md:flex grid grid-cols-[1fr_2fr] md:grid-cols-none gap-4 p-4 border-b hover:bg-white transition-all duration-300'
      key={index}
    >
      
      <div className='flex-shrink-0'>
        <img
          className='w-28 h-28 object-cover rounded-md border bg-indigo-50 shadow-sm'
          src={item.docData.image}
          alt={item.name}
        />
      </div>

      
      <div className='flex-1 text-sm text-zinc-700'>
        <p className='text-lg font-semibold text-neutral-800'>{item.docData.name}</p>
        <p className='text-sm mb-1'>{item.docData.speciality}</p>

        <p className='text-sm font-medium mt-2 text-zinc-800'>Address:</p>
        <p className='text-xs text-zinc-600'>{item.docData.address.address1}</p>
        <p className='text-xs text-zinc-600'>{item.docData.address.address2}</p>

        <p className='text-xs mt-3 text-zinc-700'>
          <span className='font-medium text-sm'>Date & Time:</span>{slotDateFormat(item.slotDate)} | {item.slotTime}
        </p>
      </div>

      
      <div className='flex flex-col gap-2 justify-end items-center mt-4 md:mt-0'>
        {/* {!item.cancelled && item.payment && !item.isCompleted && <button className='text-sm rounded-md py-2 px-4 border border-primary text-primary hover:bg-primary hover:text-white transition duration-300'>
          Paid
        </button>  }
       {!item.cancelled && item.payment &&!item.isCompleted && <button className='text-sm rounded-md py-2 px-4 border border-primary text-primary hover:bg-primary hover:text-white transition duration-300'>
          Pay Online
        </button> } 
        {!item.cancelled && !item.isCompleted &&<button onClick={()=>cancelAppointment(item._id)} className='text-sm rounded-md py-2 px-4 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition duration-300'>
          Cancel Appointment 
        </button> }
        {item.cancelled && !item.isCompleted &&<p onClick={()=>toast.info('Appointment Already Cancelled')} className='text-sm rounded-md py-2 px-4 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition duration-300'>
          Booking cancelled  
        </p>}
        {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>} */}
        {item.payment ? (
  <span className=" text-sm rounded-md py-1 px-3 bg-green-100 text-green-700 border border-green-400 hidden">
    paid
  </span>
) : (
  !item.cancelled && (
    <button
      onClick={() => navigate("/esewaPay", { state: { appointment: item } })}
      className="text-sm rounded-md py-2 px-4 border border-primary text-primary hover:bg-primary hover:text-white transition duration-300"
    >
      Pay Online
    </button>
  )
)}
        
        {item.payment ? (
  <button className="text-sm rounded-md py-2 px-4 border border-green-500 text-green-500">
    Payment Completed
  </button>
) : (
  <>
    {!item.cancelled && !item.isCompleted && (
      <button
        onClick={() => cancelAppointment(item._id)}
        className="text-sm rounded-md py-2 px-4 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition duration-300"
      >
        Cancel Appointment
      </button>
    )}

    {item.cancelled && !item.isCompleted && (
      <p
        onClick={() => toast.info("Appointment Already Cancelled")}
        className="text-sm rounded-md py-2 px-4 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition duration-300"
      >
        Booking cancelled
      </p>
    )}

    {item.isCompleted && (
      <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
        Completed
      </button>
    )}
  </>
)}
      </div>
    </div>))
  }
  </div>
  </div>
)
  }



export default MyAppointments