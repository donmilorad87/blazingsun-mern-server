const hbs = require('nodemailer-express-handlebars')
const nodemailer = require("nodemailer")


const MailerSender = async (mailOptions,defaultLayout) => {

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASS 
    }
  },
  {
    // default message fields
  
    // sender info
    from: 'Blazing Sun <blazingsun@blazingsun.space>',
    headers: {
        'X-Laziness-level': 9999 // just an example header, no need to use this
    }
  })
  
  const handlebarOptions = {
    viewEngine: {
      partialsDir: './templates/',
      layoutsDir: './templates/',
      defaultLayout: defaultLayout
    },
    viewPath: './templates/'
  }
  
  transporter.use('compile', hbs(handlebarOptions))

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
     /* console.log(error)
      res.json({
        message: err.message
    })*/
    return error
    } else {
    /*
      res.json({
                  message: 'Email Send'
              })

      console.log('Email sent: ' + info.response);
      */
     return info
    }
  })

}

module.exports = MailerSender