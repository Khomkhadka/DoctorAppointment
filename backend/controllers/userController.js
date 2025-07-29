import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import cloudinary from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import authUser from '../middlewares/authUser.js';
import appointmentModel from '../models/appointmentModel.js';
const { v2: cloudinaryV2 } = cloudinary;



//api to sign user account
const registerUser = async(req, res)=>{
   try {
    
    const { name, email,password} = req.body

    if (!name || !password || !email){
        return res.json ({success:false, message:"Required Email or Password"})
    }
    if(!validator.isEmail(email)){
        return res.json ({success:false, message:"Required valid Email"})
    }

    if(password.length < 8 ||
  !/[A-Z]/.test(password) ||
  !/[a-z]/.test(password) ||
  !/[0-9]/.test(password) ||
  !/[@$!%*?&]/.test(password)){
         return res.json ({success:false, message:"Required strong Password"})
    }

    //Hashin user password with bcrypt
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const userData = {
        name,
        email,
        password:hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET )

    res.json({success:true,token})

   } catch (error) {
       console.log(error)
       res.json({success:false, message:error.message})
   }
}

const loginUser = async(req,res)=>{
    try {
        
        const {email,password} = req.body
        const user = await userModel.findOne({email})

        if(!user){
           return res.json({success:false, message:"User doesnot exist"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        
        if(isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"invalid credentials"})
        }

    } catch (error) {
        console.log(error)
       res.json({success:false, message:error.message})
    }
}

// api for user profile
const getProfile = async (req, res)=>{
  try {
    
    const userId  = req.userId
    const userData = await userModel.findById(userId).select('-password')

    res.json({success:true,userData})

  } catch (error) {
    console.log(error)
     res.json({success:false, message:error.message})
  }
}

// Api to update user
// const updateProfile = async (req,res)=>{
//     try {

//         const{ userId, name, phone, address, dob, gender} = req.body
//         const imageFile = req.file

//         if( !name || !phone || address || dob || gender){
//             return res.json({success:false,message:"Data Missing"})
//         }

//         await userModel.findByIdAndUpdate(userId,{name,phone,address:json.parse(address),dob,gender})

//         if(imageFile){

//             //upload image to cloudinary
//             const imageUpload = await cloudnary.upLoader.upload(imageFile.path,{resources_type:'image'})
//             const imageURL = imageUpload.secure_url

//             await userModel.findByIdAndUpdate(userId,{image:imageURL})
//         }
        
//         res.json({success:true,message:"profile"})

//     } catch (error) {
//         console.log(error)
//         res.json({success:false, message:error.message})
//     }
// }

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const userId = req.userId;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const updatedData = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender
    };

    if (imageFile) {
      // Upload image to Cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
      updatedData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updatedData);

    res.json({ success: true, message: "Profile updated successfully." });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to book appointment
const bookAppointment = async (req, res)=>{

  try {

    const {docId, slotDate, slotTime} = req.body
    const userId = req.userId;
    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
         return res.json({success:false,message:'Doctor is not available'})
    }
    
    let slots_booked = docData.slots_booked

    // check slot availability
    if(slots_booked[slotDate]){
       if (slots_booked[slotDate].includes(slotTime)){
            return res.json({success:false,message:'Slot is notavailable'})
       }else{
         slots_booked[slotDate].push(slotTime)  
       }
      }else {
      slots_booked[slotDate] = [] 
      slots_booked[slotDate].push(slotTime)
      }

      const userData = await userModel.findById(userId).select('-password')
       
      delete docData.slots_booked

      const appointmentData ={
         userId,
         docId,
         userData,
         docData,
         amount:docData.fees,
         slotTime,
         slotDate,
         date:Date.now()
      }

      const newAppointment = new appointmentModel(appointmentData)
      await newAppointment.save()

     // save new slots
     await doctorModel.findByIdAndUpdate(docId,{slots_booked})

     res.json({success:true,message:'Appointment Booked'})

      } catch (error) {
       console.log(error);
      res.json({ success: false, message: error.message });
    }
}

// Api to get user cancel and list appointment
const listAppointment = async (req,res) =>{
  try {

    const userId = req.userId
    const appointments = await appointmentModel.find({userId})

    res.json({success:true,appointments})
    
  } catch (error) {
     console.log(error);
      res.json({ success: false, message: error.message });
  }
}

//Api to canclled appointment
const cancelAppointment = async (req, res) =>{

  try {

    const { appointmentId } = req.body
    const userId = req.userId
    console.log(userId)
    const appointmentData = await appointmentModel.findById(appointmentId)
    // checking app user
    if (appointmentData.userId !== userId) {
      return res.json({success:false,message:'Unauthorized action'})
      
    }

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

const updatePaymentStatus = async (req, res) => {
  try {
    const { transaction_uuid } = req.body;

    if (!transaction_uuid) {
      return res.status(400).json({
        success: false,
        message: "Transaction UUID is required",
      });
    }

    // Use the transaction_uuid directly as appointment _id
    const appointment = await appointmentModel.findById(transaction_uuid);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check if already paid to avoid duplicate updates
    if (appointment.payment === true) {
      return res.status(200).json({
        success: true,
        message: "Payment already completed",
      });
    }

    appointment.payment = true;
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment,updatePaymentStatus}


