const 
    ObjectID  = require('mongodb').ObjectID,
    constants = require(_$+'types/constants'),
    mongoHelper = require(_$+'helpers/mongo'),
    Exception = require(_$+'types/exception')

function normalize(mongoRecord){
    const 
        AuthToken = require(_$+'types/authToken'),
        newRecord = AuthToken.new()

    for (let property in newRecord)
        if (mongoRecord.hasOwnProperty(property))
            newRecord[property] = mongoRecord[property]

    newRecord.id = mongoRecord._id.toString()
    return newRecord
}

function denormalize(obj){
    const 
        ObjectID  = require('mongodb').ObjectID,
        clone = Object.assign({}, obj)

    if (obj.id)
        clone._id = new ObjectID(obj.id)

    delete clone.id
    return clone
}


module.exports = {
    
    mongoHelper,


    /**
     *
     */    
    async create(record){
        return new Promise(async (resolve, reject)=>{
            try {
    
                if (!record)
                    return reject(new Exception({ log : 'record is blank', code : constants.ERROR_INVALID_ARGUMENT }))

                const db = await mongoHelper.getCollection('authTokens'),
                    writeRecord = denormalize(record)
    
                db.collection.insertOne(writeRecord, (err, result) => {
                    if (err || !result.ops.length)
                        return reject(new Exception({ inner: { err, result } }))

                    db.done()
                    resolve(normalize (result.ops[0]))
                })
    
            } catch (ex){
                reject(ex)
            }
        })
    },
    
    
    /**
     *
     */
    async delete (id){
        return new Promise(async (resolve, reject) => {
    
            try {
                const db = await mongoHelper.getCollection('authTokens')
    
                db.collection.deleteOne({ _id : new ObjectID(id) }, err => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))
    
                    db.done()
                    resolve()
                })
    
            } catch (ex){
                reject(ex)
            }
    
        })
    },
    
    
    /**
     *
     */
    async deleteForProfile(profileId){
        return new Promise(async (resolve, reject) => {
    
            try {
                const db = await mongoHelper.getCollection('authTokens')
    
                db.collection.deleteMany({ profileId }, err => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))
    
                    db.done()
                    resolve()
                })
    
            } catch (ex){
                reject(ex)
            }
    
        })
    },
    

    /**
     *
     */
    async deleteForContext(profileId, context){
        return new Promise(async (resolve, reject) => {
    
            try {
                const db = await mongoHelper.getCollection('authTokens');
    
                db.collection.deleteMany({     
                    $and: [ 
                        { 'profileId' :{ $eq : profileId } },
                        { 'context' :{ $eq : context } },
                    ]  
                }, err => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))
    
                    db.done()
                    resolve()
                })
    
            } catch (ex){
                reject(ex)
            }
    
        })
    },


    /**
     *
     */    
    async getForProfile(profileId){
        return new Promise(async (resolve, reject) => {
    
            try {
                const db = await mongoHelper.getCollection('authTokens');
    
                db.collection.find({ profileId }).toArray((err, docs) => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))
    
                    const results = []
                    for (let i = 0 ; i < docs.length ; i ++)
                        results.push(normalize(docs[i]))
    
                    db.done()
                    resolve(results)
                })
    
            } catch (ex){
                reject(ex)
            }
    
        })
    },
    

    /**
     *
     */
    async getById(key){
        return new Promise(async (resolve, reject) => {
    
            try {
                const db = await mongoHelper.getCollection('authTokens')
    
                db.collection.findOne({ _id : new ObjectID(key) }, (err, doc) => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))
    
                    db.done()
                    resolve(doc? normalize(doc) : null)
                })
    
            } catch (ex){
                reject(ex)
            }
    
        })
    }

}
