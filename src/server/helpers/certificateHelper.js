/**
 * Used to fake ssh certicates on localhosts
 */
const pem = require('pem')

module.exports = async function(){
    return new Promise(function(resolve, reject) {
        pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
            if (err)
                return reject()

            return resolve(keys)
        })
    })
}