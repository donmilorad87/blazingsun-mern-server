const express = require('express')
const router = express.Router()

const { userUpdateValidationParameters, userUpdateEmailValidationParameters, userUpdateUsernameaVlidationParameters, userUpdatePasswordVlidationParameters} = require('../validators/auth')
const { runUpdateValidation,runUpdateEmailValidation,runUpdateUsernameValidation, runUpdatePasswordValidation} = require('../validators')

//import controller
const {requireSignin, adminMiddleware, arrangeInfo} = require('../controllers/auth')
const {read, update,updateEmail,updateUsername,updatePassword , upload} = require('../controllers/user')

const multer  = require('multer')
const uploade = multer({ dest: 'uploads/' })


router.get('/user/:id', requireSignin, read)

router.put('/user/update', userUpdateValidationParameters, runUpdateValidation, requireSignin, arrangeInfo,update)
router.put('/admin/update', userUpdateValidationParameters, runUpdateValidation, requireSignin, adminMiddleware, update)
router.put('/user/update/email', userUpdateEmailValidationParameters, runUpdateEmailValidation, requireSignin, updateEmail)  
router.put('/user/update/username', userUpdateUsernameaVlidationParameters, runUpdateUsernameValidation, requireSignin, updateUsername)  
router.put('/user/update/password', userUpdatePasswordVlidationParameters, runUpdatePasswordValidation, requireSignin, updatePassword)  


router.post('/upload', function (req, res, next) {
    console.log(req.body) //contains the text fields
  })




module.exports = router