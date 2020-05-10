const   
    settings = require(_$+'helpers/settings'),
    Exception = require(_$+'types/exception'),
    Sendgrid = require('sendgrid')
    

module.exports = {
    send : async function(to, subject, body){

        let helper = Sendgrid.mail,
            fromEmail = new helper.Email(settings.fromEmail),
            toEmail = new helper.Email(to),
            content = new helper.Content('text/plain', body),
            mail = new helper.Mail(fromEmail, subject, toEmail, content),
            sg = Sendgrid(settings.sendgridKey),
            request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            })
            
        return new Promise((resolve, reject) => {
            try {
                sg.API(request, function (err) {

                   if (err) 
                        return reject(new Exception())

                    resolve({code : 0, message: 'Email sent'})
                })

            } catch (ex) {
                reject (ex)
            }
        })
    }
}