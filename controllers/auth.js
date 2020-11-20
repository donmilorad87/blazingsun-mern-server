const User = require('../models/user')
const Token = require('../models/token')
const jwt = require('jsonwebtoken')

const expressJwt = require('express-jwt')
const _ = require('lodash')
const MailerSender = require('../controllers/mail')
const {OAuth2Client} = require('google-auth-library')

exports.changeEmail = (username,id, email, activeEmail,callback) => {



const token = jwt.sign({id, email, username, activeEmail}, process.env.JWT_ACCOUNT_EDIT_EMAIL, {expiresIn: '10m'})

let code = makeid(24)
                              
const tokenn = new Token({token,code})
tokenn.save((err, tokene)=>{
  if(err){
    console.log('Token could not be inserted in DB', err)
    return res.status(401).json({
      error: 'Error saving account token in database, Try sign up again.'
    })
  }

  var mailOptions = {
    to: email,
    subject: 'Changing email',
    template: 'changeEmail',
    context: {
      username: username,
      code,
      siteAdress: process.env.CLIENT_URL
    }
  }

  

  User.findOne({email}).exec((err, userr) => {

    if(userr){
   
      return callback('Email is taken')
    }else{
      
      MailerSender(mailOptions,'changeEmail.handlebars').then(()=>{
    
    
        console.log('Email sent.')
       return callback(true)
       
         
       }).catch((err)=>{
         
         console.log('Email not sent.')
         return callback(false)
         })  
    }

  })

})


  


}

exports.singup = (req, res) => {
    const {username, email, password} = req.body

    User.findOne({email}).exec((err, user) => {
      
                if(user){
                    return res.status(400).json({
                        error: 'Email is taken'
                    })
                }
                else{
                  User.findOne({username}).exec((err, userr) => {

                    if(userr){
                    return res.status(400).json({
                      error: 'Username is taken'
                  })
                  }else{

                   //save
                   /*return user.updateOne({activationLink: token}, (err,success) =>{
                    if(err){
                      console.log('Reset password link error', err)
                      return json.status(400).json({
                        error:'Database connection error on user password forgot request'
                      })
                    }else{
                      MailerSender(mailOptions,'passwordReset.handlebars').then(()=>{

                        res.json({
                            message: `Email has been sent to ${user.email}. Follow the instructions.`
                        })
                        
                      }).catch((err)=>{
                       
                        res.json({
                          message: 'Email not sent.'
                        })
                        console.log(err)
                      })
                    }

                  })*/
                  
                  const token = jwt.sign({username, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '10m'})
                    
                  
                 
                  let code = makeid(24)
              
              
                  
                  const tokenn = new Token({token,code})

                  tokenn.save((err, tokene)=>{
                      if(err){
                        console.log('Token could not be inserted in DB', err)
                        return res.status(401).json({
                          error: 'Error saving account token in database, Try sign up again.'
                        })
                      }
                    

                      var mailOptions = {
                        to: email,
                        subject: 'Account activation link',
                        template: 'activation',
                        context: {
                          username: username,
                          code,
                          siteAdress: process.env.CLIENT_URL
                        }
                      }
                      
                      MailerSender(mailOptions,'activation.handlebars').then(()=>{
                        
                        
                      return res.status(200).json({
                          message: 'Email sent.'
                      })
                        
                      }).catch((err)=>{
                        console.log(err)
                        return res.status(401).json({
                          message: 'Email not sent.'
                        })
    
                        
                      })

                    })
                   
                   
                  }
                  })
                }               

                
                  
                

            })
}
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!#@#$%^&*()_+';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.emailChangeVerification = (req, res) =>{
  const {code} = req.body
  //console.log(token, 'krmkaaaaa')

  Token.findOneAndRemove({code}).exec((err, token) => {
    console.log(token)
    if(token !== null){
      jwt.verify(token.token, process.env.JWT_ACCOUNT_EDIT_EMAIL, function(err, decoded){
        if(err){
          console.log('JWT verify account activation error', err)
          return res.status(401).json({
            error: 'Expired link, signup again'
          })
        }
        const {id,activeEmail,email} = jwt.decode(token.token)
        
        //console.log(jwt.decode(token),'krmki') 
        User.findOne({_id: id}, (err, user) => {
          if(err || !user){
              return res.status(400).json({
                  error:'User not found'
              })
          }
          //console.log(user,'ovde smooooo33')
           
          if(user.emailList.data.length === 0){
            user.emailList.data.push(activeEmail, email)
          }
          else{
              user.emailList.data.push(email)
          }
          user.email = email 
          //ovde upis u listu email
          //ovde upisivanje novog emaila
    
          user.save((err, updatedUser) => {
            if(err){
                console.log('User update error', err)
  
                 if(err.errmsg.includes('email')){
                        return res.status(400).json({
                            error: 'That email is taken'
                        })
                    }
                
                
            }else{
                
                updatedUser.hashed_password = undefined
                updatedUser.salt = undefined
                res.json(updatedUser)
    
            }
            
        })
        })
        
  
        
      })
  
    }else{
      return res.status(401).json({
        message:'Something went wrong try again.'
      })
    }
    

  })

  
}

exports.accountActivation = (req, res) =>{
  const {code} = req.body
  
  Token.findOneAndRemove({code}).exec((err, token) => {
    console.log(token)

    if(token !== null){
      jwt.verify(token.token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded){
        if(err){
          console.log('JWT verify account activation error', err)
          return res.status(401).json({
            error: 'Expired link, signup again'
          })
        }
        const {username,email,password} = jwt.decode(token.token)
  
        const user = new User({username,email,password})
  
        user.save((err, user)=>{
          if(err){
            console.log('Save user in account actrivation error', err)
            return res.status(401).json({
              error: 'Error saving user in database, Try sign up again'
            })
          }
          return res.status(200).json({
            message: 'Singup Successs. Please sign in',
            user : user
          })
        })
      
      })
  
    }else{
      return res.status(401).json({
        error:'We can not find that code for token. Try again.'
      })
    }

  })
  
}

exports.signin = (req, res) => {
  const {username, email, password} = req.body
  //check if user exist
  let obj = {}
  if(username === undefined && email !== undefined){
    obj = {email}
  }else if (email === undefined && username !== undefined) {
    obj = {username}
  }

  console.log(obj,'prepoznavanje da li je username ili email')

  User.findOne(obj).exec((err,user) => {
    if(err || !user){
      return res.status(400).json({
        error:`User with that ${Object.getOwnPropertyNames(obj)[0]} does not exist`
      })
    }
    //if it does than check password

    if(!user.authenticate(password)){
      return res.status(400).json({
        error:'Provided password is not matchin the real password'
      }) 
    }
    //generate token adn send to client

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET,{expiresIn: '7d'})
    const {_id, username, email, role} = user
    
    return res.json({
      token,
      user: {_id, username, email, role}
    })

    

  })
}
exports.arrangeInfo = (req,res,next) => {
  User.findById({_id: req.user._id}).exec((err,user) => {
    if(err || !user){
      return res.status(400).json({
          error:'User not found'
      })
    }
    const {username, email, password} = req.body

    console.log(req.body,'ovde je user profile')
    console.log(user,'ovde je user')
    let arre =[]
    for (let [key, value] of Object.entries(req.body)) {
      if(value){
        console.log(`${key}: ${value}`);
        arre.push(key)
        
      }
      
    }
    for (let i =0; i<arre.length; i++){
      
      console.log(user[arre[i]]) 
    }
    console.log('ovo je areere', arre)
   
    next()
  })
}



exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET //req.user._id
})

exports.adminMiddleware = (req,res,next) => {
    User.findById({_id: req.user._id}).exec((err,user) => {
      if(err || !user){
        return res.status(400).json({
            error:'User not found'
        })
      }


      if(user.role !== 'admin'){
        return res.status(400).json({
          error:'Admin recourse. Access Denided.'
        })
      }

      req.profile = user

      next()
    })
}
exports.forgotPassword = (req,res) =>{
  const {email} = req.body

  User.findOne({email}, (err,user) => {
    if(err || !user){
      return res.status(400).json({
        error:'User with that email does not exist'
      })
    }
 
    const token = jwt.sign({_id: user._id ,username: user.username}, process.env.JWT_RESET2_PASSWORD, {expiresIn: '10m'})

    var mailOptions = {
        to: email,
        subject: 'Password reset link',
        template: 'passwordReset',
        context: {
          username: user.username,
          token: token,
          siteAdress: process.env.CLIENT_URL
        }
      }
      
      return user.updateOne({resetPasswordLink: token}, (err,success) =>{
      if(err){
        console.log('Reset password link error', err)
        return json.status(400).json({
          error:'Database connection error on user password forgot request'
        })
      }else{
        MailerSender(mailOptions,'passwordReset.handlebars').then(()=>{

          res.json({
              message: `Email has been sent to ${user.email}. Follow the instructions.`
          })
          
        }).catch((err)=>{
          
          res.json({
            message: 'Email not sent.'
          })
          console.log(err)
        })
      }
    })
  })
}

exports.resetPassword = (req,res) =>{
  const { resetPasswordLink, newPassword } = req.body
    if(resetPasswordLink){
      jwt.verify(resetPasswordLink, process.env.JWT_RESET2_PASSWORD, function(err,decoded){
        if(err){
          return res.status(400).json({
            error:'Expired link for Password Reset. Try Again.'
          })
        }

        User.findOne({resetPasswordLink}, (err,user) => {
          if(err || !user){
            console.log(err)
            return res.status(400).json({
              error:'Something went wrong. Try Later.'
            }) 
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: ''
          }

          console.log(user)
          //user = _.extend(user, updatedFields)

          user.password = newPassword
          user.resetPasswordLink = ''
          console.log(user)
         
          user.save((err, result) => {
            if(err){
              console.log(err)
              return res.status(400).json({
                error:'Error reseting user password.'
              }) 
            }

            console.log(result,'res')
            res.json({
              message:`Great! Now you can login with youre new password.`
            })
          })


        })
      })    
    }

}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.googleLogin = (req,res) => {

  const {idToken} = req.body
console.log(idToken)
  client.verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT_ID}).then(response => {
    console.log('Google Login response', response)
    
    const {email_verified, name, email} = response.payload
    console.log(email_verified, name, email)
    if(email_verified){
      User.findOne({email}).exec((err, user) => {
        if(user){
          const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
          const {_id, email, username, role} = user

          return res.json({
            token, 
            user:{_id, email, username, role}
          })

        }else{
          let password = email + process.env.JWT_SECRET
          user = new User({username:name, email, password})
          user.save((err,data) => {
            if (err){
              console.log('ERROR GOOGLE LOGIN ON USER SAVE', err)

              return res.status(400).json({
                error:'User signup failed with google'
              })
            }
            const token = jwt.sign({_id: data._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
            const {_id, email, username:name, role} = user

            return res.json({
              token, 
              user:{_id, email, username:name, role}
            })
          })
        }
      })
    }
    else{
      return res.status(400).json({
        error:'Google login failed, try again'
      })
    }

  })
}