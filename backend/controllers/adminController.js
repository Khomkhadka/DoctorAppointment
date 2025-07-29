import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"

//API for adding doctor
const addDoctor =async(req,res)=>{
    try{
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body
        const imageFile =req.file
        
        //checking for all data to add doctor 
        if(!name || !email||!password || !speciality || !degree || !experience || !about || !fees || !address ){
            return res.json({success:false,message:"Missing details"})
        }
        //validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})

        }
        if(password.length<8){
            return res.json({success:false,message:"Please enter a strong password"})
        }
        //hashing doctor password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        
        //upload image to cloudinary
        const imageUpload= await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"
        })
        const imageUrl=imageUpload.secure_url
        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()

        }
        const newDoctor=new doctorModel(doctorData)
        await newDoctor.save()
        res.json({success:true,message:"Doctor Added"})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
//api for the admin login
const loginAdmin=async(req,res)=>{
try{
    const {email,password}=req.body
    if(email===process.env.ADMIN_EMAIL && password ===process.env.ADMIN_PASSWORD){
        const token=jwt.sign(email+password,process.env.JWT_SECRET)
        res.json({success:true,token})
    }
    else{
        res.json({success:false,message:"Invalid credentials"})
    }

}
catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
}
}

// Api to get all doctor in adminpanel
const allDoctors = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
        res.json({success:false,message: error.message})
    }
};

// Api for all appointment
const appointmentsAdmin = async (req, res) =>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true, appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//api to cancel app fron admin
const cancelAppointmentByAdmin = async (req, res) =>{

  try {

    const { appointmentId } = req.body
   
    const appointmentData = await appointmentModel.findById(appointmentId)

    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})
    
    // releasing doctor
    const {docId,slotDate, slotTime} = appointmentData

    const doctorData = await doctorModel.findById(docId)

    let slots_booked = doctorData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, {slots_booked})

    res.json({ success:true, message:'Appointment Cancelled'})

  } catch (error) {
     console.log(error);
      res.json({ success: false, message: error.message });
  }
}  


// Api Danboard
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({},'-password');
    const appointments = await appointmentModel.find({});

    const totalRevenue = appointments
      .filter(item => !item.cancelled)
      .reduce((total, item) => total + item.amount, 0);

    const nonCancelApp = appointments.filter(item => !item.cancelled).length;
    const cancelApp = appointments.filter(item => item.cancelled).length;

    const allData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patient: users.length,
      totalRevenue,
      nonCancelApp,
      cancelApp,
      latestAppointments: [...appointments].reverse().slice(0, 5),
      users,
    };

    res.json({ success: true, data: allData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,cancelAppointmentByAdmin,adminDashboard}


