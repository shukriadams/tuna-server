/**
 * Used to fake ssh certicates on localhosts
 */

module.exports = async ()=>{
    const pem = require('pem')

    return new Promise((resolve, reject)=>{
        pem.createCertificate({ days: 1, selfSigned: true }, (err, keys)=>{
            if (err)
                return reject()

            return resolve(keys)
        })
    })
}