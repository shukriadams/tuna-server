const 
    xmlreader = require('xmlreader'),
    Exception = require(_$+'types/exception')

module.exports = {
    async toDoc(xmlText){
        return new Promise((resolve, reject) => {

            try {

                xmlreader.read(xmlText, function (err, doc){
                    if (err)
                        return reject(new Exception(err))

                    resolve(doc)
                })

            } catch (ex) {
                reject (ex)
            }

        })
    }
}