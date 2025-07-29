import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {
  const {dToken,dashData,setDashData,getDashData,cancelAppointment,completeAppointment}=useContext(DoctorContext)
const {slotDateFormat}=useContext(AppContext)
  useEffect(()=>{
    if(dToken){
      getDashData()
    }

  },[dToken])

  return dashData && (
  
       <div className="w-full min-h-screen bg-blue-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <p className="text-gray-600">Total Appointments</p>
          <h2 className="text-3xl font-bold">{dashData?.appointments || 0}</h2>
        </div>
       <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <p className="text-gray-600">Total Patients</p>
          <h2 className="text-3xl font-bold">{dashData?.patients || 0}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <p className="text-gray-600">Earnings</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Rs. {dashData?.earnings || 0}</h2>
        </div>
      </div>

      

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Patients List</h2>
        
           
            
          

  <div className='pt-4 border border-t-0'>
{
  dashData.latestAppointments.map((item,index)=>(
    <div className='flex items-center px-6 gap-3 py-3 hover-bg-gray-100 justify-between' key={index}>
      <img className='rounded-full w-10' src={item.userData.image} alt="" />
      
        <p className='text-gray-800 font-medium'>{item.userData.name}</p>
        <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
      
       {item.cancelled ? 
                    <p className="text-red-400 text-xs font-medium sm:text-lg mr-2">Cancelled</p>
                   : item.isCompleted ? 
                    <p className="text-green-600 text-xs font-medium sm:text-lg ">Completed</p>
                   : 
                    <div className="flex">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-10 cursor-pointer"
                        src={assets.cancel_icon}
                        alt=""
                      />
                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-10 cursor-pointer "
                        src={assets.tick_icon}
                        alt=""
                      />
                    </div>
                  }

    </div>
  )

  )
}

  </div>

          
      </div>
    </div>
  
  )
}

export default DoctorDashboard
