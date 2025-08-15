import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose';
import historyModel from './models/ChatHistory.js';
const app = express();
const server = http.createServer();
const io = new Server(server , {
    cors : {origin : "*"}
});


// establish the connection to the mongo db 
mongoose.connect('mongodb+srv://manzialpe:loloChat@cluster0.ax8rtc6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>console.log("Connected to mongo db"))
.catch((e)=> console.log(`Error : ${e.message}`));

io.on("connection" ,(socket) =>{
    console.log("Socket server connected");

    socket.on('message',(msg:string)=>{
    console.log("Message from the client:" , msg);
    io.emit("message",msg)
    });

    socket.on("chat message",async(msg)=>{
     console.log(msg);
     const newHistrory = new historyModel({
        userId:socket.id,
        message:msg
     })
     await newHistrory.save()
     console.log("History saved!!")
     io.emit("sent msg",msg)
    })
    socket.on("disconnect",()=>{
        console.log('socket sever disconected');
    });
})

const PORT = 5000
server.listen(PORT , ()=>{
    console.log("server listening on :" , PORT)
})

