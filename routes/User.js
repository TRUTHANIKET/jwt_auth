const express = require('express');
const router = express.Router();
const User = require('../models/Usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const mailgun = require("mailgun-js");
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
    url="http://localhost:3000/emailverify"
    const user=await User.findOne({name:req.body.name})
    if (!user) return res.json("user not found")
    const validpassword=await bcrypt.compare(req.body.password,user.password)
    if(!validpassword) return res.json("invalid password")
    const token=await jwt.sign({_id:user._id},process.env.SECRET_JWT)
    res.cookie('jwt',token,{
        httpOnly:true,
        maxAge:24*60*60*1000
    })
    const isverified=await user.verified
    if (!isverified){
        const mailgun = require("mailgun-js");
const DOMAIN = "mg.anicreate.tech";
const mg = mailgun({apiKey: process.env.MAILGUN_KEY, domain: DOMAIN});
const data = {
	from: "kyapatameiko@gmail.com",
	to: `${user.name}`,
	subject: "Hello",
	html: `<h1>please verify your email <a href=${url}><button>Verify</button></a> </h1>`
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});

    }
    if(!isverified) return res.json("please check your email to verify your account")
    

    
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


router.get('/logout',(req,res)=>{
    res.cookie('jwt','',{maxAge:0})
    res.json("logged out")
})


router.get('/emailverify',async(req,res)=>{
    const token=await req.cookies.jwt
    if (token){
        const claims=await jwt.verify(token,process.env.SECRET_JWT)
    if(!claims) return res.json("not authenticated")
    const user=await User.findOne({_id:claims._id})
    if(!user) return res.json("user not found")
    user.verified=true
    await user.save()
    res.json("user verified")
    }
    else{
        res.send ("<center><h1>Sorry the link look's broken</h1></center>")
    }
})



module.exports=router