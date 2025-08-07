require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const { callbackify } = require("util");
const cors = require("cors");

app.use(cors({
  origin : process.env.FRONTEND_URL
}))
const io = new Server(server , {
   cors : {
     origin : process.env.FRONTEND_URL
   }
})


app.get("/undefined/checkBackend",(req,res)=>{
  res.json({
    msg : "Backend connected"
  })
})
io.on("connection",(socket)=>{
   console.log("A new user is connected with socketid "+ socket.id);
   socket.on("message",(msg)=>{
     io.emit("message",msg)
   });

   // now codes are written for file sharing
   
   // 1. this code is for send socketid to sender
   socket.on("send-socket-id-to-sender",(peerSocketId,callback)=>{
    try{
      //console.log("Peer socket Id :- "+peerSocketId)
      socket.to(peerSocketId).emit("got-peer-socket-id",{
        peerSocketId : socket.id
      });
      callback({
        success : true,
        msg : "Server is healthy",
        peerSocketId : peerSocketId
      })
    }
    catch(err){
      callback({
        success : false,
        msg : err.message
      })
    }
   })


   socket.on("send-offer",({peerSocketId , offer } , callback)=>{
    console.log("offer sent by socketid :- " +socket.id);
    console.log("offer sent to socketid :- "+ peerSocketId);
    socket.to(peerSocketId).emit("receive-offer",{
      offer : offer ,
      peerSocketId : socket.id,
      msg : "Incoming offer"
    })
    callback({
      success : true,
      msg : "Offer sent"
    })
   })

   socket.on("ice-candidate",({candidate , to },callback)=>{
    console.log("Ice candidate sharing");
    socket.to(to).emit("ice-candidate",{
      candidate,
      from : socket.id
    })
    callback({
      success : true,
      msg : "Ice sent"
    })
   })

   socket.on("send-answer",({peerSocketId , answer }, callback)=>{
    console.log("Answer sent by socket id :- "+socket.id);
    console.log("Answer sent to socket id "+peerSocketId);
    socket.to(peerSocketId).emit("receive-answer",{
      answer : answer,
      peerSocketId : socket.id,
      msg : "Incoming answer"
    })
    callback({
      success : true,
      msg : "Answer sent successfully"
    })
   })

   socket.on("send-file-metadata",(data)=>{
    //console.log(data);
    const {peerSocketId , metadata} = data;
    socket.to(peerSocketId).emit("file-meta-data-sended",{
      metadata
    })
   })

   socket.on("send-file",(id , callback)=>{
    socket.to(id).emit("send-file",{
      from : socket.id
    })
   })

})
server.listen(process.env.PORT,()=>{
  console.log("App is running on " + process.env.PORT);
})

