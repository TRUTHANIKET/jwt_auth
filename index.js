const express=require('express')
const Router=require('./routes/User')
const mongoose= require('mongoose')
const cors  = require('cors');
const cookieParser = require('cookie-parser')
require('dotenv').config();


const app=express()
app.use(cookieParser())
app.use(express.json())
app.use(Router)
app.use(cors(
    {
        credentials:true,
        origin:"http://localhost:3000"
    }
));
mongoose.connect(process.env.DB_URI,{useNewUrlParser:true}).then(()=>{
console.log("connected to db")    
app.listen(3000,()=>{
    console.log('Server is up on port 3000')
})})


