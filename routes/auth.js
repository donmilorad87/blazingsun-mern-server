const express = require('express')
const router = express.Router()

//import controller

const {singup,accountActivation, emailChangeVerification, signin, forgotPassword, resetPassword, googleLogin} = require('../controllers/auth')

//import validatotrs
const { userSingupValidator, userSignInValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/auth')
const { runValidation , ipMiddleware, runValidationSignIn,runValidationForgotPassword, runValidationResetPassword} = require('../validators')

router.post('/singup', userSingupValidator, runValidation, singup)
router.post('/account-activation', accountActivation)
router.post('/email-change-verification', emailChangeVerification)
router.post('/signin', userSignInValidator, runValidationSignIn, signin)

//forgot reset password
router.put('/forgot-password', forgotPasswordValidator, runValidationForgotPassword, forgotPassword)
router.put('/reset-password', resetPasswordValidator, runValidationResetPassword, resetPassword)

//google auth

router.post('/google-login', googleLogin)

module.exports = router