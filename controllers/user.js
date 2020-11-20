const User = require('../models/user')
const {changeEmail} = require('./auth')

exports.read = (req, res) => {
    const userId = req.params.id
    console.log('krmaca', userId)
    User.findById(userId).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"User not found"
            })
        }
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    })
}

exports.updatePassword = (req, res) => {
    //console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body)
    const { activePassword, newPassword, confirmNewPassword } = req.body

    console.log('updating log ', activePassword, newPassword, confirmNewPassword )

    User.findOne({_id: req.user._id}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error:'User not found'
            })
        }
            if(!user.authenticate(activePassword)){
                return res.status(400).json({
                    error:'Active Password you provide is not matchin the real password'
                }) 
            }

            

            if(activePassword === newPassword){
                return res.status(400).json({
                    error:'You provided same password'
                }) 
            }

            user.password = newPassword
            console.log(user, 'ovje useresa 6666666666666666666666666')
            
            user.save((err, updatedUser) => {
                if(err){
                    console.log('User update error', err)
                  
                        console.log('User update error', err)
                     
                    
                }else{


                    //updatedUser.hashed_password = undefined
                    //updatedUser.salt = undefined
                    //res.json(updatedUser)
                    console.log('ja sam ', ' | Svinjaca dobra', updatedUser)

                    return res.status(200).json({
                        message: 'Password changed'
                    })
                }
                
            })

            
    })
}

exports.updateEmail = (req, res) => {
    //console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body)
    const { email } = req.body


    User.findOne({_id: req.user._id}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error:'User not found'
            })
        }


                changeEmail(user.username,user._id, email, user.email, function(result){
                    console.log('resultero', result)
                    if(result === true){
                    
                        console.log('Email change verification send on requested email.')
                        return res.status(200).json({
                            message: 'Email change verification send on requested email.'
                        })

                    }else{
                        return res.status(400).json({
                            error: 'That email is taken'
                        })
                    }
                }) 
            
            
        
    })
}


exports.updateUsername = (req, res) => {
    //console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body)
    const {username} = req.body


    User.findOne({_id: req.user._id}, (err, user) => {
        if(err || !user){
            return 'User not found'
        }
        
     
        let arrayere = []
     
            if(user.username === username){
  
                arrayere.push(`Youre username is allready ${username}`)
                console.log(`Youre username is allready ${username}`)
            }else{
                //ovde upis u listu usera
            
                //console.log(user,'ovde smooooo')
                if(user.usernameList.data.length === 0){
                    user.usernameList.data.push(username, user.username)
                }
                else{
                    user.usernameList.data.push(username)
                }
                
                user.username = username 
            }
        
        
        if(arrayere.length>0){
            return res.status(400).json({
                error: arrayere.toString()
            })
        }else{
            user.save((err, updatedUser) => {
                if(err){
                    console.log('User update error', err)
                  
                        console.log('User update error', err)
                        if(err.errmsg.includes('username')){
                            return res.status(400).json({
                                error: 'That username is taken'
                            })
                        }
                    
                }else{


                    updatedUser.hashed_password = undefined
                    updatedUser.salt = undefined
                    res.json(updatedUser)
                }
                
            })
        }
       
   
    })
}

exports.update = (req, res) => {
    //console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body)
    const {username, email, password} = req.body


    User.findOne({_id: req.user._id}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error:'User not found'
            })
        }
        
     
        let arrayere = []
        if(username !== undefined && username !== null){
            if(user.username === username){
            /* return res.status(400).json({
                    error: `Youre username is allready ${username}`
                })*/
                arrayere.push(`Youre username is allready ${username}`)
            }else{
                //ovde upis u listu usera
            
                //console.log(user,'ovde smooooo')
                if(user.usernameList.data.length === 0){
                    user.usernameList.data.push(username, user.username)
                }
                else{
                    user.usernameList.data.push(username)
                }
                
                user.username = username 
            }
        }
        if(user.email === email){
            arrayere.push(`Youre email is allready ${email}`)
            /*return res.status(400).json({
                error: `Youre email is allready ${email}`
            })*/
        }
        if(arrayere.length>0){
            return res.status(400).json({
                error: arrayere.toString()
            })
        }else{
            user.save((err, updatedUser) => {
                if(err){
                    console.log('User update error', err)
                    if(err.errmsg.includes('username')){
                        return res.status(400).json({
                            error: 'That username is taken'
                        })
                    }
                     if(err.errmsg.includes('email')){
                            return res.status(400).json({
                                error: 'That email is taken'
                            })
                        }
                    
                    
                }else{

                    if(email !== undefined && email !== null){
                        
                        if(username !== undefined && username !== null){
                            //ovde upisujemo tokenzapromenu
                            console.log(user.email, email, 'emajl')
                            changeEmail(username,user._id, email, user.email, function(result){
                                console.log('resultero', result)
                                if(result === true){
                                    updatedUser.emailUpdated='Email change verification send on requested email.'
                                }else{
                                    return res.status(400).json({
                                        error: 'That email is taken'
                                    })
                                }
                            }) 
                        }else{
                            changeEmail(user.username,user._id, email, user.email, function(result){
                                console.log('resultero', result)
                                if(result === true){
                                    updatedUser.emailUpdated='Email change verification send on requested email.'
                                }else{
                                    return res.status(400).json({
                                        error: 'That email is taken'
                                    })
                                }
                            }) 
                        }
                        
                    }

                    updatedUser.hashed_password = undefined
                    updatedUser.salt = undefined
                    res.json(updatedUser)
                }
                
            })
        }
       
   
    })
}


exports.upload = (req, res) => {    
    console.log('kokor')
    
/*myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
    if (err) {
        console.log(err)
        return res.status(500).send({ msg: "Error occured" });
    }
    // returing the response with file path and name
    return res.send({name: myFile.name, path: `/${myFile.name}`});
});*/
}

