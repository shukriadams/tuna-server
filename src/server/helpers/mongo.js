const 
    MongoClient = require('mongodb').MongoClient,
    settings = require(_$+'helpers/settings'),
    constants = require(_$+'types/constants'),
    Exception = require(_$+'types/exception')

module.exports = {
    
    async getCollection(name){
        return new Promise(async (resolve, reject)=>{
            try {
                MongoClient.connect(settings.mongoConnectionString, (err, client)=>{
                    if (err)
                        return reject(new Exception({ code : constants.ERROR_DATABASE_NOT_AVAILABLE, inner : err }))

                    const db = client.db(settings.mongoDBName),
                        collection = db.collection(settings.mongoCollectionPrefix + name)
    
                    resolve({ collection , done : ()=>{
                        client.close()
                    }})
    
                })

            } catch (ex) {
    
                reject(ex)
            }
        })
    },
    
    async initialize(){
        return new Promise(async (resolve, reject)=>{
            try {
                MongoClient.connect(settings.mongoConnectionString, (err, client)=>{
                    if (err)
                        return reject(new Exception({ code : constants.ERROR_DATABASE_NOT_AVAILABLE, inner : err }))
    
                    const db = client.db(settings.mongoDBName)

                    db.collection(`${settings.mongoCollectionPrefix}profiles`).createIndex( { 'identifier': 1  }, { unique: true, name : `${settings.mongoCollectionPrefix}profiles_unique` })
                    db.collection(`${settings.mongoCollectionPrefix}songs`).createIndex( { 'nameKey': 1  }, { unique: true, name : `${settings.mongoCollectionPrefix}songs_unique` })
                    db.collection(`${settings.mongoCollectionPrefix}authTokens`).createIndex( { 'context': 1, 'profileId' : 1  }, { unique: true, name : `${settings.mongoCollectionPrefix}authTokens_unique` })

                    client.close()
                    resolve()
                })

            } catch (ex) {
    
                reject(ex)
            }
        })
    }
}