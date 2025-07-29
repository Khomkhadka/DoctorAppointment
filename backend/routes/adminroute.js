import express from 'express'
import { addDoctor,loginAdmin,} from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authadmin.js'
import { allDoctors,appointmentsAdmin,cancelAppointmentByAdmin,adminDashboard } from '../controllers/adminController.js'
import { changeAvailability, deleteDoctor } from '../controllers/doctorController.js'

const adminRouter=express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,cancelAppointmentByAdmin)
adminRouter.get('/dashboard',authAdmin,adminDashboard)

adminRouter.post('/delete-doctor', authAdmin, deleteDoctor);

export default adminRouter