import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import { connectToDb, Content, User } from './db';
import {z} from "zod"
import  bcrypt  from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'
import { userMiddleWare } from './middleware';
dotenv.config()
const app = express();
const PORT =process.env.PORT||4000

connectToDb()
app.use(express.json())
app.use(cookieParser())

const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(10, 'Username must be at most 10 characters').toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});


app.post("/api/v1/signup",async (req: Request, res: Response) =>{
 
  const result = signUpSchema.safeParse(req.body)
  if(!result.success){
  res.status(411).json({ error: 'Error in inputs', details: result.error.format() })
  return;
  }
  const { username, password } = result.data;
  try {
    const existingUser=  await User.findOne({username})
    if(existingUser){
      res.status(403).json({"error":"user already exist"})
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser= new User({username,password:hashedPassword})
    await newUser.save()
    res.status(200).json({ message: 'Signed up successfully' });
    return
  } catch (error) {
    console.error('Error during user creation:', error);
     res.status(500).json({ error: 'Error while signing up' });
     return
  }
})

app.post("/api/v1/signin",async(req,res)=>{
  const result = signUpSchema.safeParse(req.body)
  if(!result.success){
  res.status(411).json({ error: 'Error in inputs', details: result.error.format() })
  return;
  }
  
  const { username, password } = result.data;
  try {
    const existingUser=  await User.findOne({username})
    if(!existingUser){
      res.status(403).json({"error":"user do not exist"})
      return
    }
    const hashPassword= existingUser.password
    const isPasswordCorrect =await bcrypt.compare(password, hashPassword) 
    if(!isPasswordCorrect){
      res.status(403).json({"error":"Incorrect Password"})
      return
    }
    const secret= process.env.JWT_SECRET_KEY as string
    const token = jwt.sign({userId:existingUser._id, username:existingUser.username},secret,{expiresIn:"1d"})
    res.cookie('token', token, {
      httpOnly: true,                         // Cannot be accessed via JS (protects from XSS)
      secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in production
      sameSite: 'lax',                        // Helps prevent CSRF (can also use 'strict' or 'none' with caution)
      maxAge: 60 * 60 * 1000,                 // 1 hour in milliseconds
    })
    res.status(200).json({"message":"user successfully logged in"})
    return
  } catch (error) {
    console.error('Error during user signIn:', error);
     res.status(500).json({ error: 'Error while signing in' });
     return
  }
})


app.post("/api/v1/content", userMiddleWare, async (req: Request, res: Response) => {
  try {
    const { type, link, title } = req.body;
    //@ts-ignore
    const { userId } = req.user;

    const content = new Content({
      title,
      link,
      type,
      userId,
      tags: [],
    });

    await content.save();
    res.status(201).json({ message: "Content created", content });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/api/v1/content",userMiddleWare ,async(req,res)=>{
  try {
    //@ts-ignore
    const userId= req.user.userId
    const contents = await Content.find({userId}).populate("userId", "username");
    res.status(200).json({ contents });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Server error" });
  }
})
app.delete("/api/v1/content", userMiddleWare, async (req, res) => {
  try {
    //@ts-ignore
    const userId = req.user?.userId;
    const contentId = req.body.contentId;

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
       res.status(400).json({ message: "contentId is not valid" });
       return
    }

    const result = await Content.deleteOne({ _id: contentId, userId });

    if (result.deletedCount === 0) {
       res.status(404).json({ message: "No content found or not authorized" });
       return
    }

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ error: "Server error" });
    return
  }
});

app.post("/api/v1/brain/share",(req,res)=>{
  
})
app.get("/api/v1/brain/:shareLink",(req,res)=>{
  
})


app.listen(PORT,()=>{
  console.log("Server is running on PORT :" + PORT)
})