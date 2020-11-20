const mongoose = require('mongoose')
const crypto = require('crypto')

//user schema

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        trim: true,
        required: true,
        unique:true,
        max:32
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique:true,
        lowercase:true
    },
    hashed_password:{
        type: String,
        required: true
    },
    salt: String,
    role:{
        type:String,
        default: 'subscriber'
    },
    resetPasswordLink:{
        data: String,
        default: ''
    },
    activationLink:{
        data: String,
        default: ''
    },
    emailUpdated:{
        data: String,
        default: ''
    },
    usernameList:{
        data: Array
    },
    emailList:{
        data: Array
    }
}, {timestamps:true})

//vrtual fields

userSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

//some methotods that will be applied to the schema itself

userSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword: function(password){
        if(!password) return ''
        try {
            return crypto.createHmac('sha512', this.salt)
                  .update(password)
                  .digest('hex');
        } catch(err) {
            return ''        
        }
    },

    makeSalt: function(){
        return Math.round(new Date().valueOf() * Math.random()) + ''
    }
}


module.exports = mongoose.model('User', userSchema)