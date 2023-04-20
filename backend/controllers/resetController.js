const express = require("express");
const router = new express.Router();
const userdb = require("../models/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt  = require("jsonwebtoken");
const asyncHandler = require('express-async-handler')

const keysecret = process.env.ACCESS_TOKEN_PRIVATE_KEY;


// email config

// const transporter = nodemailer.createTransport({
//    // service:"gmail",
//     host: 'smtp.gmail.com',
//         port: 465,
//         secure: true,
//     auth:{
//         user:process.env.EMAIL,
//         pass:process.env.PASSWORD
//         // user: testAccount.user, // generated ethereal user
//         // pass: testAccount.pass,

//     }
// }) 

let transporter = nodemailer.createTransport({
    host: 'webmail.evolvingsols.com',
    port:  25, // or 587 for non-SSL
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'FET@evolvingsols.com',
        pass: 'Gmail#@5689'
    }
});
// send email Link For reset Password
const  sendEmailLinkForResetPassword = asyncHandler(async (req, res) => {
    console.log(req.body)

    const {email} = req.body;

    if(!email){
        res.status(401).json({status:401,message:"Enter Your Email"})
    }

    try {
        const userfind = await userdb.findOne({email:email});
        console.log(userfind);
        // token generate for reset password
        const token = jwt.sign({_id:userfind._id},keysecret,{
            expiresIn:"600s"
        });
        
        const setusertoken = await userdb.findByIdAndUpdate({_id:userfind._id},{verifytoken:token},{new:true});
        console.log(email);
        
        if(setusertoken){
            const mailOptions = {
                from:process.env.EMAIL,
                to:email,
                subject:"Sending Email For password Reset",
                text:`This Link Valid For 5 MINUTES http://localhost:3000/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
            }

            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log("in send Email error",error);
                    res.status(401).json({status:401,message:"email not send"})
                }else{
                    console.log("Email sent",info.response)
                    res.status(201).json({status:201,message:"Email sent Successfully"})
                }
            })

        }

    } catch (error) {
        res.status(401).json({status:401,message:"invalid user"})
    }

});


// verify user for forgot password time
const  verifyUserForForgotPassword = asyncHandler(async (req, res) => {
    const {id,token} = req.params;

    try {
        const validuser = await userdb.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token,keysecret);

        console.log(verifyToken)

        if(validuser && verifyToken._id){
            res.status(201).json({status:201,validuser})
        }else{
            res.status(401).json({status:401,message:"user does not exist"})
        }

    } catch (error) {
        res.status(401).json({status:401,error})
    }
});


// change password

const  changePassword = asyncHandler(async (req, res) => {
    const {id,token} = req.params;

    const {password} = req.body;

    try {
        const validuser = await userdb.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token,keysecret);

        if(validuser && verifyToken._id){
            //const newpassword = await bcrypt.hash(password,10);
            const salt = await bcrypt.genSalt(10)
            const newpassword = await bcrypt.hash(password, salt)
            const setnewuserpass = await userdb.findByIdAndUpdate({_id:id},{password:newpassword});

            setnewuserpass.save();
            res.status(201).json({status:201,setnewuserpass})

        }else{
            res.status(401).json({status:401,message:"user does not exist"})
        }
    } catch (error) {
        res.status(401).json({status:401,error})
    }
})



module.exports = {
	changePassword,
	verifyUserForForgotPassword,
	sendEmailLinkForResetPassword
  }







