import mongoose from "mongoose";

const campSchema = new mongoose.Schema({
    docId: { type:String , required:true },
    title: { type: String,required: true},
    message: {type: String, required: true },
    image: { type: String, required: true },
    startDate: { type: Date, required: true},
    endDate: {type: Date,required: true }
})

const freeCampModel = mongoose.models.freeCamp || mongoose.model('freeCamp',campSchema)
export default freeCampModel