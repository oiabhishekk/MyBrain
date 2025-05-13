import { NextFunction, Request, Response } from "express"
import  jwt  from 'jsonwebtoken';


const userMiddleWare = async (req:Request,res:Response,next: NextFunction)=>{
  const token = req.cookies.token
  if(!token){
    res.status(401).json({ error: "Unauthorized. Token missing" })
    return
  }
  try{
  const decodedUserData=await jwt.verify(token,process.env.JWT_SECRET_KEY as string)
  //@ts-ignore
  req.user = decodedUserData
  next();
  }catch(error){

    console.error('log in again:', error);
     res.status(500).json({ error: "Login error" });
     return
  }
}
export {userMiddleWare}