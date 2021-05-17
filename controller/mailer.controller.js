const nodeMailer = require('nodemailer')


let adminEmail = process.env.MAIL_USER;
let adminPassword = process.env.MAIL_PASSWORD;
let mailHost = process.env.MAIL_HOST
let mailPort = process.env.MAIL_PORT


// let adminEmail = "songoku1451999@gmail.com";
// let adminPassword = "manh123456";
// let mailHost = "smtp.gmail.com"
// let mailPort = 587



let sendMail = (to, subject, htmlContent) => {

    console.log(adminEmail)
    console.log(mailHost)
    console.log(adminPassword)
    console.log(mailPort)


    let transporter = nodeMailer.createTransport({ // config mail serve
        host: mailHost,
        port: mailPort,
        secure: false, //use SSL_TLS
        auth: {
            user: adminEmail,
            pass: adminPassword
        }
    });
    let options = {
        from: adminEmail,
        to: to,
        subject: subject,
        html: htmlContent
    };
    return transporter.sendMail(options);// returN  a Promise
}

module.exports = sendMail;
