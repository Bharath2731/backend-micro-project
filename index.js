const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const dotenv = require("dotenv");
dotenv.config();

const app = express()
const Participant = require ('./models/userModel')

const errorHandler = (error,res)=>{
    console.log(error);
    res.status(500).json({
        status:'failed',
        message:'internal error'
    })
}

app.get('/',(req,res)=>{
    res.json({
        message: 'go to /health to check the status of the server'
    })
})

app.get("/health", (req, res) => {
    res.json({
      status: "success",
      message: "server is up and running",
      time: new Date()
    });
})

  app.post('/signup',async(req,res) => {
    try {
        const {fullname, email, password, age, gender, mobile}=req.body;
        //check user with same email already exists
        const participant= await Participant.findOne({email})        
        if(!(participant)){
            const encryptedPassword= await bcrypt.hash(password,10)
            await Participant.create({fullname, email, password: encryptedPassword, age, gender, mobile})  
            res.json({
            status:'successful',
            message:'user created successfully'
           }) 
        }
        else{
            res.json({
                status : 'unsuccessful',
                message: 'email already registered'
            })
        }
    } 
    catch (error) {
        console.log(error)
        errorHandler(error,res);
    }
})

app.post('/login',async (req,res)=>{
    try {
        const {email,password}=req.body;
        let isValidParticipant = await Participant.findOne({email});
        if(isValidParticipant){
            let isPasswordCorrect = await bcrypt.compare(password,isValidParticipant.password)
            if(isPasswordCorrect){
                const jwtoken = jwt.sign(isValidParticipant.toJSON(),process.env.jwtSecretKey,{expiresIn:60*60*24})
                res.json({
                    status:'successful',
                    message:'logged in successfully',
                    jwtoken
                })
            }
            else{
                res.json({
                    status:'error',
                    message: 'incorrect password'
                })
            }
        }
        else{
            res.json({
                status:'error',
                message:'email doesnot exist'
            })
        }
        
    } catch (error) {
        console.log(error);
        errorHandler(error,res);
    }
})

app.listen(process.env.PORT||5000, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});