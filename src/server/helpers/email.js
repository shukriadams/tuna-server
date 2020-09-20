module.exports = {
    send : async function(to, subject, body){
        const   
            settings = require(_$+'helpers/settings'),
            nodemailer = require('nodemailer')

        if (!settings.smtpHost)
            return

        const transporter = nodemailer.createTransport({
            host: settings.smtpHost,
            port: settings.smtpPort,
            auth: {
                user: settings.smtpUsername,
                pass: settings.smtpPassword
            }
        })

        await transporter.sendMail({
            from: settings.fromEmail,
            to,
            subject,
            text: body
        })
    }
}