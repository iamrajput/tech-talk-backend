const express = require('express');
const app = express()
const connectWithDb = require('./config/db')
require('dotenv').config();
const {notFound,errorHandler} = require('./middlewares/errorMiddleware')
const cors = require('cors')


const PORT = process.env.PORT || 4000
//db connection
connectWithDb()


//regular middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

var option = {
  origin: process.env.FRONT_END_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(option))




//routers
const user = require('./routes/userRoutes')
const chat = require('./routes/chatRoutes')
const message = require('./routes/messageRoutes')

//route middleware
app.use('/api/v1',user)
app.use('/api/v1',chat)
app.use('/api/v1',message)

app.use(notFound)
app.use(errorHandler)


const server = app.listen(PORT,() => {
    console.log(`Server is running on port number ${PORT}`)
});

const io = require("socket.io")(server,{
  pingTimeout:60000,
  cors:{
    origin:process.env.FRONT_END_URL
  }
})


io.on("connection",(socket) => {
  console.log(`Connected to socket.io`);
  socket.on('setup',(userData) => {
      socket.join(userData._id);
      socket.emit("connected");
  })

  socket.on('join chat',(room) => {
      socket.join(room);
      console.log("user joined room "+ room);
  })

  socket.on('typing',(room) => {
      socket.in(room).emit('typing');
      console.log('typingggg')
  });

  socket.on('stop typing',(room) => {
      socket.in(room).emit('stop typing');
  })

  socket.on('new message',(newMesageRecieved) => {
      var chat = newMesageRecieved.chat;
      if(!chat.users)return console.log("chat users not found")

      chat.users.forEach(user => {
        if(user._id == newMesageRecieved.sender._id)return;
        socket.in(user._id).emit("message recieved",newMesageRecieved)
      });
  })

  socket.off("setup",() => {
    console.log("user Disconnected");
    socket.leave(userData._id);
  })


})
