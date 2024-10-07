// Author: Zhuojun Shao
// Date: August 2024
const express=require('express');
const mongoose=require('mongoose');
const http=require('http');
const socketIo=require('socket.io');
const cookieParser=require('cookie-parser');
const authRoutes=require('./routes/auth');
const chatRoutes=require('./routes/chat');
const Message=require('./models/Message');
const Notification=require('./models/Notification');
const moment=require('moment-timezone');
require('dotenv').config();

const app=express();
const server=http.createServer(app); //create a HTTP server with Express
const io=socketIo(server);

//connect the mongodb with the .env doc
mongoose.connect(process.env.MONGO_URI, {
});

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.static('public')); // Serve static files from the 'public' directory


app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

const users = {}; // Object to store the mapping of socket IDs to usernames

io.on('connection', (socket)=>{
    console.log('User connected');

    // Set the username for a connected socket
    socket.on('setUsername', (userid,username)=>{
        users[userid]=username;
        console.log(`User ${username} connected，ID: ${userid}`);
    });

    // Handle incoming messages from clients
    socket.on('sendMessage', async (data)=>{
        const {content}=data;
        const username=data.username;

        if (!username || !content) {
            console.error('blank username or content for sendMessage');
            return;
        }
        // save  message
        try{
            const message=new Message({
                username:username,
                content:content,
                timestamp:new Date(),
            });
            await message.save();

            // Broadcast the message to all connected clients
            io.emit('receiveMessage', {
                // username: username===users[socket.id] ? 'Me' : username,
                username:username,
                content:content,
                timestamp:message.timestamp,
            });
        }catch(error){
            console.error('Failed to save message', error);
        }
    });

    // Handle incoming notifications from clients
    socket.on('sendNotification', async (data)=>{
        const {content}=data;
        const username=data.username;
        console.log(content,username)

        if (!username || !content) {
            console.error('blank username or content for sendNotification');
            return;
        }
        // save  notifications
        try{
            const notification=new Notification({
                username:username,
                content:content,
                timestamp:new Date(),
            });
            await notification.save();

            // Broadcast the notifications to all connected clients
            io.emit('receiveNotification', {
                // username: username===users[socket.id] ? 'Me' : username,
                username:username,
                content:content,
                timestamp:notification.timestamp,
            });
        }catch(error){
            console.error('Failed to save notification', error);
        }
    });

    socket.on('disconnect', ()=>{
        console.log('User disconnected');
        delete users[socket.id]; // Remove the user from the mapping
    });
});

const PORT=process.env.PORT || 3000;
server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
