// Author: Zhuojun Shao
// Date: August 2024

// 'express' is used to create the server
const express=require('express');
// 'jwt' is for JSON Web Token handling
const jwt=require('jsonwebtoken');
// 'User' is the user model
const User=require('../models/User');
// dotenv loads environment variables from a .env file
require('dotenv').config();

const router=express.Router();

// user register
router.post('/register', async(req, res)=>{
    const {username, password}=req.body;

    // Check if the user already exists in the database.
    try {
        let user=await User.findOne({username});
        if (user) {
            return res.status(400).send('user already exists');
        }

        user=new User({username, password});
        await user.save();

        res.status(201).send('register successfully');
    } catch (err) {
        res.status(500).send('server wrong');
    }
});

// user login
router.post('/login', async(req, res)=>{
    const{username, password}=req.body;

    try {
        const user=await User.findOne({username});
        if (!user) {
            return res.status(400).send('wrong user name or password');
        }

        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).send('wrong user name or password');
        }
//  If the password matches, create a JSON Web Token (JWT) that includes the user's ID, sign it with a secret key
// chatgpt generate.
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {expiresIn:'1h' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({
            message:'Login successfully',
            userId:user._id
        })
    } catch(err){
        res.status(500).send('server wrong');
    }
});


module.exports=router;
