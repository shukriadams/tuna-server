

module.exports = {
    async toDoc(xmlText){
        const parser = require('xml2js').parseString,
            Exception = require(_$+'types/exception')

        return new Promise((resolve, reject) => {

            try {

                parser(xmlText, (err, doc)=>{
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