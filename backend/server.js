import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminroute.js'
import doctorRouter from './routes/doctorroute.js'
import userRouter from './routes/userRoute.js'


// app config
const app = express()
const port = process.env.PORT || 5000
connectDB()
connectCloudinary()

// middleware
app.use(express.json())

app.use(cors())

//apiendpoint
app.use('/api/admin',adminRouter)
//localhost:4000/api/admin

//endpoint for frontend doctors
app.use('/api/doctor',doctorRouter)

//endpoint path for user register api
app.use('/api/user',userRouter)


app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port, ()=> console.log("Server Sterted",port))
