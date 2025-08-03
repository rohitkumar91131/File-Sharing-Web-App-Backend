require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server , {
   cors : {
     origin : process.env.FRONTEND_URL
   }
})

io.on("connection",(socket)=>{
   console.log("A new user is connected with socketid "+ socket.id);
   socket.on("message",(msg)=>{
     io.emit("message",msg)
   });

   socket.on("join-room-for-file-sharing",(id, callback)=>{
    try{
      socket.join(id);
      console.log(id);
      socket.to(id).emit({
        success : true,
        msg : "peer joined successfully"
      })
      callback({
        success : true,
        msg :"Room joined successfully"
      })
    }
    catch(err){
      callback({
        success : false,
        msg : err.message
      })
    }
   })
})
server.listen(process.env.PORT,()=>{
  console.log("App is running on " + process.env.PORT);
})

