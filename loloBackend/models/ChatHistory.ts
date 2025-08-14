import mongoose from "mongoose";

const historySchema  = new mongoose.Schema({
    userId : {type:String , required: true},
    message :{type: String  , required: true},
    date : { type : Date , default: Date.now()}
})

const historyModel = mongoose.model("History" , historySchema);

export default historyModel