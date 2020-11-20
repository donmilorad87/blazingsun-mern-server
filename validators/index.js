const { validationResult } = require('express-validator')
const emailCheck = require('email-check')
const Token = require('../models/token')
var parser = require('ua-parser-js');

//za povezivanje sa pythonom
//const {spawn} = require('child_process');``

exports.runValidationForgotPassword = (req,res,next) => {
   
    //console.log(username, email, password)
    const errors = validationResult(req)
    //console.log(errors)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errorIterator(errors)
        })
    }
    next()
}

exports.runValidationResetPassword = (req,res,next) => {
   
    //console.log(username, email, password)
    const errors = validationResult(req)
    //console.log(errors)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errorIterator(errors)
        })
    }
    next()
}

exports.runValidationSignIn = (req,res,next) => {
    const {username, email, password } =req.body
    //console.log(username, email, password)
    const errors = validationResult(req)
    //console.log(errors)
    let arrayh =[]
    console.log(username, email)
    if(username === undefined && email !== undefined){
        arrayh = errors.errors.filter(error => error.username === 'username');
    }
    else if(email === undefined && username !== undefined){
        arrayh = errors.errors.filter(error => error.email === 'email');
        console.log('ovde smo')
    }else if(username === undefined && email === undefined){
        arrayh = ['morate imati bar username ili password jebem mu lebac']
    }
    console.log(errors, arrayh)
    if(arrayh.length>0){
        return res.status(422).json({
            error: errorIterator(errors)
        })
    }
    next()
}
exports.runUpdateEmailValidation = (req,res,next) => {
    const { email } = req.body

    const errors = validationResult(req)
    emailCheck(email)
        .then(function (res) {
            // Returns "true" if the email address exists, "false" if it doesn't.
            console.log('rr',res)
            //return res
            if(res === false){
                errors.errors.push({
                    value: email,
                    msg: 'E-mail that you providing must be real',
                    param: 'email',
                    location: 'body'
                  })
            }
        })
        .catch(function (err) {
            if (err.message === 'refuse') {
            // The MX server is refusing requests from your IP address.\
           // console.log(err.message)
      
            } else {
            // Decide what to do with other errors.
        
            }
            errors.errors.push({
                value: email,
                msg: 'E-mail that you providing must be real',
                param: 'email',
                location: 'body'
              })
        })
        .finally(() =>{

            //console.log('tetris',errors)
            if(!errors.isEmpty()){
                return res.status(422).json({
                    //error: errors.array()[0].msg
                    error: errorIterator(errors)
                })
            }
            next()
        })


}

exports.runUpdateUsernameValidation = (req,res,next) => {
    const { username } = req.body

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errorIterator(errors)
        })
    }
    next()

}

exports.runUpdatePasswordValidation = (req,res,next) => {
    const { activePassword, newPassword, confirmNewPassword } = req.body

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errorIterator(errors)
        })
    }
    next()

}

exports.runUpdateValidation = (req,res,next) => {
    const {username, email, password } =req.body
    //console.log(username, email, password)
    const errors = validationResult(req)

    let arrayh =[]
    let arrayh2 =[]
    let arrayh3 =[]

    let objErr = {
        errors:[]
    }
    if(username === undefined || username === null){
        arrayh = errors.errors.filter(error => error.param !== 'username')

    }else{
        arrayh = errors.errors.filter(error => error.param === 'username')
        //console.log(arrayh,'kekeraea')
    }
    if(password === undefined || password === null){
        arrayh2 = errors.errors.filter(error => error.param !== 'password')
       
    }else{
        arrayh2 = errors.errors.filter(error => error.param === 'password')
        //console.log(arrayh2,'krmacinja2')
    }
    if(email === undefined || email === null){
        arrayh3 = errors.errors.filter(error => error.param !== 'email')

    }else{
       
        arrayh3 = errors.errors.filter(error => error.param === 'email') 
    }

   

    if(email === undefined || email === null){

        arrayh.forEach(item => objErr.errors.push(item))
        arrayh2.forEach(item => objErr.errors.push(item))

        if(objErr.errors.length){

            return res.status(422).json({
              
                error: errorIterator(objErr)
            })
        }
        next()
    }else {
        emailCheck(email).then(function (res) {
            // Returns "true" if the email address exists, "false" if it doesn't.
            if(res === false){
                obj ={
                    email:false,
                    obj:{
                    value: email,
                    msg: 'E-mail that you providing must be real',
                    param: 'email',
                    location: 'body'
                    }
                }
            }else{
                obj = {
                    email:true,
                    obj:{
                    value: email,
                    msg: 'E-mail that you providing is real',
                    param: 'email',
                    location: 'body'
                }}
            }
        })
        .catch(function (err) {
            if (err.message === 'refuse') {
            // The MX server is refusing requests from your IP address.\
        
                obj ={
                    email:false,
                    obj:{
                    value: email,
                    msg: 'E-mail that you providing must be real',
                    param: 'email',
                    location: 'body'
                    }
                }   
            } else {
            // Decide what to do with other errors.
                obj ={
                    email:false,
                    obj:{
                    value: email,
                    msg: 'E-mail that you providing must be real',
                    param: 'email',
                    location: 'body'
                    }
                }
                }
                
        
        })
        .finally(() =>{
            arrayh.forEach(item => objErr.errors.push(item))
            arrayh2.forEach(item => objErr.errors.push(item))
           // console.log('arrayh3', obj)
            if(obj.email === false){
                arrayh3.push(obj.obj)
                //console.log('tetris3',arrayh3)
            }
            
            arrayh3.forEach(item => objErr.errors.push(item))
            //console.log('tetris3',arrayh3)
            //console.log('tetris',objErr.errors)
            
            if(objErr.errors.length){
            
                return res.status(422).json({
                    //error: errors.array()[0].msg
                    error: errorIterator(objErr)
                })
            }
            next()
            })
    }
    

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

exports.ipMiddleware = function(req, res, next) {
    //const clientIp = requestIp.getClientIp(req); 
     //console.log(req)
     //console.log(req._remoteAddress)
     
    // console.log(req.rawHeaders)
     //console.log(req.url)
     //console.log('____',req.socket._peername)
     //console.log(req.connection.remoteAddress)
     //console.log(req)

     /*var dataToSend;
     // spawn new child process to call the python script
     const python = spawn('python', ['/home/milorad/Desktop/mernBS/server/validators/script.py']);
     // collect data from script
     python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      dataToSend = data.toString();
     });
     // in close event we are sure that stream from child process is closed
     python.on('close', (code) => {
     console.log(`child process close all stdio with code ${code}`);
     // send data to browser
     console.log(dataToSend)
     });*/





     var ua = parser(req.headers['user-agent']);
     // write the result as response
    console.log(JSON.stringify(ua, null, '  '))

     let browserUserIdNum = 1
     let code = makeid(12)
     const browserId =[req.rawHeaders,req.url]
     const browserIp = req.socket._peername.address
     Token.findOne({browserIp}).exec((err,token) => {
        if(err || !token){
            const token = new Token({browserUserIdNum,code,browserId, browserIp})

            token.save((err, token)=>{
                if(err){
                  console.log('Save user in account token error', err)
              
                }
                console.log('Account token creation Successs.')
              })
        }else{
            console.log('Podignut token za 1') 
            console.log(token,'3333333333333333333333333')

            token.browserUserIdNum = token.browserUserIdNum + 1
            console.log(token,'33333333333333333333333332')
            token.save({browserIp}, (err,success) =>{
                if(err){
                  console.log('Reset password link error', err)
                
                }else{
                    console.log('updated and inc')
                }

              })
        }
        //if it does than check password
   
    
         /*if(token.inc()){
            return res.status(200).json({
                message:'Podignut token za 1'
              }) 
        }else{
            return res.status(400).json({
                error:'Desila se neka greska'
              }) 
        }*/
        
    
      })
     
     
  
     
     next()
 }

exports.runValidation = (req,res,next) => {
    const {username, email, password ,confirmPassword} = req.body
    //console.log(username, email, password)
    const errors = validationResult(req)
    //console.log(errors)
    emailCheck(email)
        .then(function (res) {
            // Returns "true" if the email address exists, "false" if it doesn't.
            console.log('rr',res)
            //return res
            if(res === false){
                errors.errors.push({
                    value: email,
                    msg: 'E-mail that you providing must be real',
                    param: 'email',
                    location: 'body'
                  })
            }
        })
        .catch(function (err) {
            if (err.message === 'refuse') {
            // The MX server is refusing requests from your IP address.\
           // console.log(err.message)
      
            } else {
            // Decide what to do with other errors.
        
            }
            errors.errors.push({
                value: email,
                msg: 'E-mail that you providing must be real',
                param: 'email',
                location: 'body'
              })
        })
        .finally(() =>{

            //console.log('tetris',errors)
            if(!errors.isEmpty()){
                return res.status(422).json({
                    //error: errors.array()[0].msg
                    error: errorIterator(errors)
                })
            }
            next()
        })
        
   
}



const errorIterator = (errors) => {
   let array = []
        //console.log(errors)
   errors.errors.forEach(error => array.push(error.msg));
   //console.log('ovde smo kurkurnjak ', array.toString())
   return array.toString()

} 

const checkingEmail = (email,callback) => {
    var obj
    emailCheck(email)
    .then(function (res) {
        // Returns "true" if the email address exists, "false" if it doesn't.
        //console.log('444rr',res)
        //return res
        if(res === false){
            obj ={
                email:false,
                obj:{
                value: email,
                msg: 'E-mail that you providing must be real',
                param: 'email',
                location: 'body'
                }
            }
        }else{
            obj = {
                email:true,
                obj:{
                value: email,
                msg: 'E-mail that you providing is real',
                param: 'email',
                location: 'body'
              }}
        }
        //console.log('444rrerrrr',obj)
    })
    .catch(function (err) {
        if (err.message === 'refuse') {
        // The MX server is refusing requests from your IP address.\
        //console.log(err.message)
        obj ={
            email:false,
            obj:{
            value: email,
            msg: err.message,
            param: 'email',
            location: 'body'
            }
        }   
        } else {
        // Decide what to do with other errors.
        obj ={
            email:false,
            obj:{
            value: email,
            msg: 'E-mail that you providing must be real',
            param: 'email',
            location: 'body'
            }
        }
        
        }
        
    })
    .finally(() =>{
          
        //console.log('444rrerrrrereerere',obj)
    
        return callback(obj)
    })
   

        
}   

