import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import {assets} from '../assets/assets'
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const {userData,setUserData,token,backendUrl,loadUserProfileData} = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false);
  const [image,setImage]= useState(false)

  const updateUserProfileData = async () =>{
           try {
            
            const formData = new FormData()

            formData.append('name',userData.name)
            formData.append('phone',userData.phone)
            formData.append('address',JSON.stringify(userData.address))
            formData.append('gender',userData.gender)
            formData.append('dob',userData.dob)

            image && formData.append('image',image)

            const {data} = await axios.post(backendUrl + '/api/user/update-profile',formData,{headers:{token}})

            if (data.success) {
              toast.success(data.message)
              console.log(userData)
              await loadUserProfileData()
              setIsEdit(false)
              setImage(false)
              
            } else{
              toast.error(error.message)
            }
           } catch (error) {
            console.log(error)
            toast.error(error.message)
           }
  }

  return userData && (
    <div className="max-w-3xl mx-auto p-4">
      {
        console.log(userData)
      }
      <div className="bg-white shadow-md rounded-2xl p-6">
        <div className="flex flex-col items-center gap-4">
           {
        isEdit
        ?<label htmlFor="image">
      <div className="inline-block relative cursor-pointer">
            <img src={image ? URL.createObjectURL(image):userData.image} className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 opacity-75" alt="" />
          <img className="w-10 adsolute bottom-12 right-12" src={image ? '': assets.upload_icon}  alt="" />
      </div>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden />
        </label>
        : <img
            src={userData.image}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
      }
          {isEdit ? (
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
              className="border p-2 rounded-md w-full"
            />
          ) : (
            <p className="text-xl font-semibold text-blue-700">{userData.name}</p>
          )}
        </div>

        <hr className="my-6" />

        <div>
          <p className="text-lg font-bold text-blue-600 mb-2">Profile Detail</p>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Email ID:</p>
              <p className="text-base">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact No:</p>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.phone}
                  onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="border p-2 rounded-md w-full"
                />
              ) : (
                <p className="text-base">{userData.phone}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Address:</p>
              {isEdit ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    className="border p-2 rounded-md w-full"
                  />
                  <input
                    type="text"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    className="border p-2 rounded-md w-full"
                  />
                </div>
              ) : (
                <p className="text-base">
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              )}
            </div>
          </div>
        </div>

        <hr className="my-6" />

        <div>
          <p className="text-lg font-bold text-blue-600 mb-2">Basic Information</p>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Gender:</p>
              {isEdit ? (
                <select
                  value={userData.gender}
                  onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="text-base">{userData.gender}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth:</p>
              {isEdit ? (
                <input
                  type="date"
                  value={userData.dob}
                  onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                  className="border p-2 rounded-md w-full"
                />
              ) : (
                <p className="text-base">{userData.dob}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          {isEdit ? (
            <button
              onClick={updateUserProfileData}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              Save Info
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              Edit Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
