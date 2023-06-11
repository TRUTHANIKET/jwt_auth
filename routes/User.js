const express = require('express');
const router = express.Router();
const User = require('../models/Usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
router.get('/',(req,res)=>{
    res.json("i work man")
})

router.post('/register',async(req,res)=>{
    const userexist=await User.findOne({name:req.body.name})

    if (userexist) return res.json("user already exist")
    
    const name=await req.body.name
    const password= await req.body.password
    const salt=await bcrypt.genSalt(10)
    const hashedpassword=await bcrypt.hash(password,salt)
    const user=new User({
        name:name,
        password:hashedpassword
    })
    const saveduser=await user.save()
    res.send(saveduser)


})

router.post('/login',async(req,res)=>{
    const user=await User.findOne({name:req.body.name})
    if (!user) return res.json("user not found")
    const validpassword=await bcrypt.compare(req.body.password,user.password)
    if(!validpassword) return res.json("invalid password")
    const token=await jwt.sign({_id:user._id},process.env.SECRET_JWT)
    res.cookie('jwt',token,{
        httpOnly:true,
        maxAge:24*60*60*1000
    })
    res.json("logged in")


})


router.get('/isuserauth',async(req,res)=>{
    
        const cookie=await req.cookies.jwt
        const claims=await jwt.verify(cookie,process.env.SECRET_JWT)
        if(!claims) return res.json("not authenticated")
        const user=await User.findOne({_id:claims._id})
        const {password,...data}=await user.toJSON()
        res.json(data)
    
})



module.exports=router