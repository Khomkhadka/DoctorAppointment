import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"


const changeAvailability = async (req, res)=>{
     try {
        
        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
        res.json({success:true, message: 'Availabilty Changed'})

     } catch (error) {
        console.log(error)
        res.json({success:false,message: error.message})
     }
}

const doctorList = async (req,res)=>{
   try {
      
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})

   } catch (error) {
      console.log(error)
        res.json({success:false,message: error.message})
   }
}
// API for doctor login
const loginDoctor =async(req,res)=>{
   try{
      const {email,password} =req.body
      const doctor =await doctorModel.findOne({email})
      if(!doctor){
         return res.json({success:false,message:"invalid credential"})
      }
      const isMatch= await bcrypt.compare(password,doctor.password)

      if(isMatch){
         const token= jwt.sign({id:doctor._id},process.env.JWT_SECRET)

         res.json({success:true,token})
      }else{
         res.json({success:false,message:"invalid credential"})
      }

   }catch(error){
      console.log(error)
        res.json({success:false,message: error.message})
   }
}
// Api to get appointment for doctor panel
const appointmentDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const appointments = await appointmentModel.find({ docId });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Api to mark appointment completed for doctor panel
const appointmentComplete=async(req,res)=>{
   try{
      const {docId,appointmentId}=req.body
      const appointmentData =await appointmentModel.findById(appointmentId)
      if (appointmentData && appointmentData.docId === docId){
         await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
         return res.json({success:true,message:'appointment completed'})
      }
      else{
        return res.json({success:false,message:'Mark failed'})
      }
   }
   catch(error){
      console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
   
}
//Api to cancel appointment for doctor panel
const appointmentCancel=async(req,res)=>{
   try{
      const {docId,appointmentId}=req.body
      const appointmentData =await appointmentModel.findById(appointmentId)
      if (appointmentData && appointmentData.docId === docId){
         await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
         return res.json({success:true,message:'appointment cancelled'})
      }
      else{
        return res.json({success:false,message:'Cancellation failed'})
      }
   }
   catch(error){
      console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
   
}

//Api to get Dashboard data for doctor panel

const doctorDashboard=async(req,res)=>{
try{
    const {docId}=req.body
      
    const appointments=await appointmentModel.find({docId})

    let earnings=0
    appointments.map((item)=>{
      if(item.isCompleted || item.payment){
         earnings +=item.amount

      }
    })
let patients=[]
appointments.map((item)=>{
   if(!patients.includes(item.userId)){
      patients.push(item.userId)
   }
})
const dashData={
   earnings,
   appointments:appointments.length,
   patients:patients.length,
   latestAppointments:appointments.reverse().slice(0,5)
}
res.json({success:true,dashData})
   
}catch(error){
   console.error(error);
    res.status(500).json({ success: false, message: error.message });
}
}
//Api to get doctor profile for doctor panel
const doctorProfile = async(req,res)=>{
   try{
      const {docId}=req.body
      const profileData= await doctorModel.findById(docId).select('-password')
      res.json({success:true,profileData})


   }catch(error){
      console.error(error);
    res.status(500).json({ success: false, message: error.message });
   }
}

//Api to update doctor profile data from doctor panel
const updateDoctorProfile =async(req,res)=>{
   try{
      const {docId,fees,address,available} =req.body
      await doctorModel.findByIdAndUpdate(docId,{fees,address,available})

      res.json({success:true,message:'profile Updated'})

   }catch(error){
        console.error(error);
    res.status(500).json({ success: false, message: error.message });
   }
}

// Admin deletes doctor by ID
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndDelete(docId);
    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ success: false, message: "Failed to delete doctor" });
  }
};

export {changeAvailability,doctorList ,loginDoctor,appointmentDoctor ,appointmentCancel,appointmentComplete,doctorDashboard,doctorProfile,updateDoctorProfile,deleteDoctor}