import { createContext,useEffect,useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
export const AppContext = createContext()

const AppContentProvider = (props)=>{

    const [popUp, setPopUP] = useState(false) 
    const [doctors, setDoctors] =  useState([])
    const [userData, setUserData] = useState(false)

   const currencySymbol = 'Rs'
   const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [token, setToken]= useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    
    const getDoctorsData = async ()=>{
        try {
            
          const {data} = await axios.get(backendUrl + '/api/doctor/list')
          if(data.success){
              setDoctors(data.doctors)
          }
          else{
            toast.error(error.message)
          }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
        
    const loadUserProfileData = async ()=>{
      try {
        
        const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}});
        if(data.success){
          setUserData(data.userData)
        } else {
          toast.error(error.message)
        }
      } catch (error) {
          console.log(error)
            toast.error(data.message)
      }
    }


    useEffect(()=>{
      getDoctorsData()
    },[])

    useEffect(()=>{
      if(token){
        loadUserProfileData()
      }else{
        setUserData(false)
      }
    },[token])

    const value = {
  popUp,
  setPopUP,
  doctors,getDoctorsData,
  userData,
  setUserData,
  currencySymbol,
  token,
  setToken,
  backendUrl,
  loadUserProfileData

}

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}


export default AppContentProvider