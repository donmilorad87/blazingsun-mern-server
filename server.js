const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const socket = require('socket.io')


require('dotenv').config()


const app = express()

//connect to db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => { console.log('DB connected')})
.catch((err) => {console.log('DB Error:' , err)})

//import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

//app middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())

app.use(express.static('public')); //to access the files in public folder



app.use(cors()) //allow all origins

//app.use(cors({
 //   credentials: true,
//    origin: 'http://localhost:3000' // URL of the react (Frontend) app
//  }));

//if(process.env.NODE_ENV = 'development'){
//    app.use(cors({origin:process.env.CLIENT_URL}))
//}

//middleware
app.use('/api', authRoutes)
app.use('/api', userRoutes)

const port = process.env.PORT

const server = app.listen(port, () => {
    console.log(`Api is running on port: ${port} - ${process.env.NODE_ENV}`);
  });



const io = socket.listen(server)
require('./socket')(io);