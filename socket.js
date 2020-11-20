const socket = io => {
  let count = 0 
  let conectedUsers = []
  var srvSockets = io.sockets.clients().adapter;


 

  io.on('connection', socket => {

    count++

    console.log('New Connection')
   
    console.log(srvSockets.rooms,'33333')

    socket.broadcast.emit('wMessage','A new user has joined')


    socket.on('join',(obj) => {

      console.log(obj.username,obj.room,'3333331')
      socket.join(obj.room)

      socket.emit('wMessage',`Welcome! ${obj.username}`)
      let time = new Date().toLocaleString()
      socket.broadcast.to(obj.room).emit('message', {message:`A user ${obj.username} has joined.`, username: 'Server: ', time})
    })

   
    socket.on('sendMessage',(data, callback) =>{
      console.log(data, ';sssssssssssssssssssssss')

      socket.broadcast.emit('message', data)
      callback('Delivered')

    })




    socket.on('reconnect', (attemptNumber) => {
      console.log('reccc'); 

    });

    socket.on('disconnect', () =>{ 
      io.emit('message', 'A user has left!')
      console.log('disccc'); 
 

  })

 
  })
  


}

module.exports = socket;