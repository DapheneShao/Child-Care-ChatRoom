// Author: Zhuojun Shao
// Date: August 2024
const express = require('express');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const router = express.Router();

// get all the message
router.get('/messages', async (req, res)=>{
    try{
        const messages=await Message.find().sort({timestamp: 1});
        res.json(messages);
    }catch(err){
        res.status(500).send('server wrong');
    }
});

// get all the notification
router.get('/notification', async (req, res)=>{
    try{
        // console.log('1',Notification.find().sort({timestamp: 1})[0])
        const notifications=await Notification.find().sort({timestamp: -1});
        const notification=notifications[0];
        console.log('2',notification);
        res.json(notification);
    }catch(err){
        res.status(500).send('server wrong');
    }
});

module.exports = router;
