const nodemailer = require('nodemailer');

function emailUser(email, title, message) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: 'SeniorDesignTeam11PSU@gmail.com',
            pass: 'SeniorDesign11!'
        }
    });
    
    var mailOptions = {
        from: 'SeniorDesignTeam11PSU@gmail.com',
        to: email,
        subject: title,
        text: message
    }
    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err)
        else console.log(`> Email has been sent to ${email}`);
    });
}

module.exports = emailUser;