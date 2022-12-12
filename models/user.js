import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name : {type : String, required : true},
    status : {type : String, default : 'offline'},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    picture : String,
    id : {type : String}
})

export default mongoose.model('User', userSchema);