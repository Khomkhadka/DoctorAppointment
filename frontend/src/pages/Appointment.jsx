import React, { useContext, useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
   const {docId} = useParams()
    const {doctors, currencySymbol,popUp,setPopUP,backendUrl, token,getDoctorsData } = useContext(AppContext)
     
      const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']
      const monthOfYear = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  
      const navigate = useNavigate()

      const [docInfo,setDocInfo] = useState(null)
      const[docSlot,setDocSlot]= useState([])
      const [slotIndex,setSlotIndex] = useState(0)
      const[slotTime,setSlotTime] = useState('')
      
 



  
      const fetchDocInfo = async () =>{
          const docInfo = doctors.find(doc => doc._id === docId)
          setDocInfo(docInfo)
            //    console.log(docInfo)
      }
  
      const getAvailableSlots = async () =>{
       setDocSlot([])
 
       //get new date
       let today = new Date()
       
 
 
       for(let i=0; i<7;i++){
          // get next 7 days with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate()+i)
  
      // end time of date
      let endTime = new Date()
      endTime.setDate(today.getDate()+i)
      endTime.setHours(16,0,0,0)
  
      // setting hours
      if(today.getDate() === currentDate.getDate()){
          currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours()+1 : 10)
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      }else{
          currentDate.setHours(10)
          currentDate.setMinutes(0)
      }
  
      let timeSlots = []
  
      while ( currentDate < endTime)
      {
          let formattedTime = currentDate.toLocaleTimeString([], { hour:'2-digit',minute:'2-digit'})
         // add slot to array
         timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
         })
  
         // increase current time by 30 min
         currentDate.setMinutes(currentDate.getMinutes() + 30)
      
      }
  
      setDocSlot(prev => ( [...prev, timeSlots]))
       }
  
      }

      const bookAppointment = async () =>{

        if (!token) {
          toast.warn('Login to Book Appointment')
          return navigate('/login')
        }

        try {
          
        const date = docSlot[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth()+1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        const { data } = await axios.post(backendUrl + '/api/user/book-appointment', {docId, slotDate, slotTime},{headers:{token}})
        if (data.success) {
          toast.success(data.message)
          getDoctorsData()
          navigate('/myappointment') 
        } else{
          toast.error(data.message)
        }

        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
  
      useEffect(()=>{
           fetchDocInfo()
      },[doctors,docId])
  
      useEffect(()=>{
      getAvailableSlots()
      },[docInfo])
  
      useEffect(()=>{
       console.log(docSlot)
      },[docSlot])

  useEffect(()=>{
         getAvailableSlots()
  },[docInfo])

  return docInfo &&(
    <div>
     {/* -----doctor Detail------ */}
     <div className='flex flex-col sm:flex-row gap-4'>
      <div>
        <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
      </div>
      {/* --- Doc Info---- */}
      <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-slider mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
        <p className='flex item-center gap-2 text-2xl font-medium text-gray-900'>
          {docInfo.name}
           <img className='w-5' src={assets.verified_icon} alt="" />
        </p>
        <div className='flex item-center gap-2 text-sm mt-1 text-gray-900'>
          <p>{docInfo.degree} - {docInfo.speciality}</p>
          <button className='py-0.5 px-2 border border-gray-400 text-xs rounded-full'>{docInfo.experience}</button>
        </div>
        {/* --Doctor About--- */}
        <div>
          <p className='flex item-center gap-1 text-sm font-medium text-gray-900 mt-3'>
            About <img src={assets.info_icon} alt="" /></p>
          <p className='text-sm text-white-900 max-w-[700px] mt-1'>
             {docInfo.about}</p>
        </div>
        <p className='text-indigo-600 font-medium mt-4'>
          Appointment fee: <span className='text-red-600'>{currencySymbol}{docInfo.fees}</span>
        </p>
       
      </div>
     
     </div>
      
       {/*---booking---*/}
    
       <p className="text-xl font-semibold text-blue-700 mt-4 mb-4">Booking Your Slot: {new Date().getFullYear()},{monthOfYear[new Date().getMonth()]} </p>
       
{/* date and day */}
<div className="overflow-x-auto">
  <table className="w-full table-auto border border-blue-200 rounded-xl overflow-hidden">
    <thead className="bg-blue-50 text-blue-700">
      <tr>
        {docSlot.map((item, index) => (
          <th
            key={index}
            onClick={() => setSlotIndex(index)}
            className={`cursor-pointer p-4 text-center border border-blue-100 transition-all ${
              slotIndex === index
                ? "bg-primary text-white"
                : "hover:bg-blue-100"
            }`}
          >
            <p className="text-md font-medium">
              {item[0] && daysOfWeek[item[0].datetime.getDay()]}
            </p>
            
            <p className="text-lg font-bold">
              {item[0] && item[0].datetime.getDate()}
            </p>
          </th>
        ))}
      </tr>
    </thead>
  </table>
</div>
{/* time acc to date */}
<div className="flex items-center gap-3 w-full overflow-x-scroll hide-scrollbar mt-4">
  {docSlot.length &&
    docSlot[slotIndex].map((item, index) => (
      <div
        key={index}
        className={`bg-blue-50  text-blue-700 text-center p-3 rounded-xl border border-blue-200 shadow-sm hover:shadow-md cursor-pointer transition 
          ${             
               item.time === slotTime?
                "bg-primary text-white"
                : "hover:bg-blue-100"} `}
      >
        <p  onClick={()=>setSlotTime(item.time)} className="text-sm  font-semibold  whitespace-nowrap">{item.time.toLowerCase()}</p>
      
      </div>
    ))}
</div>
           <button onClick={bookAppointment} className=' item-center gap-2  bg-primary hover:bg-blue-600 px-8 py-3 rounded-full text-white text-sm md:mt-7 md:mb-5 hover:scale-105 transition-all duration-300 '>Make Appointment</button>
    </div>
    
  )
}

export default Appointment