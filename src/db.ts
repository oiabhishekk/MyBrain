import mongoose from "mongoose"
import bcrypt from "bcrypt"
interface IUser extends mongoose.Document{
  username:string,
  password:string
}
const userSchema= new mongoose.Schema<IUser>({
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
const contentSchema = new mongoose.Schema({
  type: {type: String,
    enum: ["document", "tweet", "youtube", "link"],
    },
  title:String,
  link:String,
  tags:[{type:mongoose.Types.ObjectId, ref:"Tag"}],
  userId:{type: mongoose.Types.ObjectId , ref :  "User" , required:true},
})
const Content = mongoose.model("Content",contentSchema)
async function connectToDb (){
  const MONGO_URI= process.env.MONGO_URI
  if (!MONGO_URI) {
    throw new Error("MongoDB URI is not defined in the environment variables.");
  }
try {
  await mongoose.connect(MONGO_URI)
  console.log("connected to DB")
} catch (error) {
  return error
}
}
// userSchema.pre<IUser>("save",async function(this:IUser,next){
//  if(!this.isModified("password")){return next()}
//   try {
//    const hashedpswd= await bcrypt.hash(this.password, 10);
//    this.password= hashedpswd;
//    return next();
//   } catch (error) {
//     return next(error as Error);
//   }
// })

const User = mongoose.model("User",userSchema);
export {User,connectToDb,Content}