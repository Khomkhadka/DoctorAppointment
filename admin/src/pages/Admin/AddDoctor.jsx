import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

    const [docImg,setDocImg] = useState(false)
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [experience,setExperience] = useState('1 Year')
    const [fees,setFees] = useState('')
    const [about,setAbout] = useState('')
    const [speciality,setSpeciality] = useState('General physician')
    const [degree,setDegree] = useState('')
    const [address1,setAddress1] = useState('')
    const [address2,setAddress2] = useState('')

    const {backendUrl, aToken} = useContext(AdminContext)

    const onSubmitHandler = async (event) =>{
        event.preventDefault()

        try {
            
            if(!docImg){
                return toast.error('please! select the Doctor Image')
            }
          
            const formData = new FormData()
            formData.append('image',docImg)
            formData.append('name',name)
            formData.append('email',email)
            formData.append('password',password)
            formData.append('experience',experience)
            formData.append('fees',Number(fees))
            formData.append('about',about)
            formData.append('speciality',speciality)
            formData.append('degree',degree)
            formData.append('address',  JSON.stringify({address1,address2}))
            
            // console form
            formData.forEach((value,key)=>{
                console.log(`${key},${value}`)
            })

            const {data} = await axios.post(backendUrl + '/api/admin/add-doctor',formData,{headers:{aToken}})
 
            if(data.success){
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')

            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <form  onSubmit={onSubmitHandler} className="bg-blue-50 px-4 sm:px-6 md:px-8 py-6 rounded-lg shadow-md max-w-6xl w-full mx-auto mt-6 space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-[#7494EC] text-center">Add Doctor</h2>

      {/* Upload area */}
      <div className="flex flex-col items-center">
        <label htmlFor="doc-img" className="cursor-pointer">
          <img
          
            src={docImg ? URL.createObjectURL(docImg):assets.upload_area}
            alt="Upload"
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain border-2 border-dashed border-[#7494EC] p-2 rounded-lg hover:shadow-md transition"
          />
        </label>
        <input type="file" onClick={(e)=>setDocImg(e.target.files[0])} id="doc-img" hidden />
        <p className="text-sm text-gray-500 mt-2 text-center">
          Upload doctor <br /> picture
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Doctor Name</label>
          <input
          onChange={(e)=> setName(e.target.value)} value={name}
            type="text"
            placeholder="Name"
            id="name"
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7494EC] focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Doctor Email</label>
          <input
            onChange={(e)=> setEmail(e.target.value)} value={email}
            type="email"
            placeholder="E-mail"
            id="email"
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7494EC] focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            onChange={(e)=> setPassword(e.target.value)} value={password}
            type="password"
            placeholder="Password"
            id="password"
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7494EC] focus:outline-none"
          />
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
          <select
            onChange={(e)=> setExperience(e.target.value)} value={experience}
            name="experience"
            id="experience"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7494EC] focus:outline-none"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i} value={`${i + 1} Year`}>{i + 1} Year</option>
            ))}
            <option value="Over 10 Year">Over 10 Year</option>
          </select>
        </div>

        {/* Fee */}
        <div>
          <label htmlFor="fees" className="block text-sm font-medium text-gray-700">Doctor Fee</label>
          <input
            onChange={(e)=> setFees(e.target.value)} value={fees}
            type="number"
            placeholder="Fee"
            id="fees"
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7494EC] focus:outline-none"
          />
        </div>

        {/* Speciality */}
        <div>
          <label htmlFor="speciality" className="block text-sm font-medium text-gray-700">Speciality</label>
          <select
            onChange={(e)=> setSpeciality(e.target.value)} value={speciality}
            id="speciality"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7494EC] focus:outline-none"
          >
            <option>General physician</option>
            <option>Gynecologist</option>
            <option>Dermatologist</option>
            <option>Pediatricians</option>
            <option>Neurologist</option>
            <option>Gastro</option>
          </select>
        </div>

        {/* Education */}
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education</label>
          <input
            onChange={(e)=> setDegree(e.target.value)} value={degree}
            type="text"
            placeholder="Education"
            id="education"
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7494EC] focus:outline-none"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            onChange={(e)=> setAddress1(e.target.value)} value={address1}
            type="text"
            placeholder="Address Line 1"
            id="address1"
            required
            className="mt-1 w-full mb-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7494EC] focus:outline-none"
          />
          <input
            onChange={(e)=> setAddress2(e.target.value)} value={address2}
            type="text"
            placeholder="Address Line 2"
            id="address2"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7494EC] focus:outline-none"
          />
        </div>

        {/* About */}
        <div className="md:col-span-2">
          <label htmlFor="about" className="block text-sm font-medium text-gray-700">About Doctor</label>
          <textarea
            onChange={(e)=> setAbout(e.target.value)} value={about}
            placeholder="Write about doctor..."
            id="about"
            rows={4}
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7494EC] focus:outline-none"
          ></textarea>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-[#7494EC] text-white px-6 py-2 rounded-md hover:bg-blue-600 transition font-semibold"
        >
          Add Doctor
        </button>
      </div>
    </form>
  )
}

export default AddDoctor
