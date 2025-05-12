import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
const app = express();

const PORT =process.env.PORT||4000


app.post("/api/v1/signup",(req,res)=>{

})
app.post("/api/v1/signin",(req,res)=>{
  
})
app.post("/api/v1/content",(req,res)=>{
  
})
app.get("/api/v1/content",(req,res)=>{
  
})
app.delete("/api/v1/content",(req,res)=>{
  
})
app.post("/api/v1/brain/share",(req,res)=>{
  
})
app.get("/api/v1/brain/:shareLink",(req,res)=>{
  
})


app.listen(PORT,()=>{
  console.log("Server is running on PORT :" + PORT)
})