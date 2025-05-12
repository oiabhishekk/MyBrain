import mongoose from "mongoose"
const userSchema= new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    minlength:3,
    maxlength:10,
    trim :true,
  },
  password:{
    type: String,
    required:true,
    trim:true,
    maxlength:100
  }
})

const User = mongoose.model("Users",userSchema);
export {User}