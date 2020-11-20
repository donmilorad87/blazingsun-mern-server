const mongoose = require('mongoose')


//token schema

const tokenSchema = new mongoose.Schema({
    token:{
        type: String
    },
    code:{
        type:String
    }
})


module.exports = mongoose.model('Token', tokenSchema)