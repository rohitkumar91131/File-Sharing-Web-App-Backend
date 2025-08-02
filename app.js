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
   })
})
server.listen(process.env.PORT,()=>{
  console.log("App is running on " + process.env.PORT);
})

