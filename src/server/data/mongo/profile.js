const 
    ObjectID  = require('mongodb').ObjectID,
    constants = require(_$+'types/constants'),
    mongoHelper = require(_$+'helpers/mongo'),
    Exception = require(_$+'types/exception')

function normalize(mongoRecord){
    let profile = require(_$+'types/profile').new()


    for (let property in profile)
        if (mongoRecord.hasOwnProperty(property))
            profile[property] = mongoRecord[property]

    profile.id = mongoRecord._id.toString()
    return profile
}

function denormalize(obj){
    let clone = {}

    for (var prop in obj)
        clone[prop] = obj[prop]

    if (obj.id)
        clone._id = new ObjectID(obj.id)

    // never persist these fields to db
    delete clone.id
    delete clone.password

    return clone
}

module.exports = {
    
    mongoHelper,

    async create(record){
        return new Promise(async (resolve, reject) => {
            try {
                if (!record)
                    return reject(new Exception({ log : 'record is blank', code : constants.ERROR_INVALID_ARGUMENT }))

                const db = await mongoHelper.getCollection('profiles'),
                    writeRecord = denormalize(record)
    
                db.collection.insertOne(writeRecord, (err, result) => {
                    if (err || !result.ops.length)
                        return reject(new Exception({ inner: { err, result } }))
                        
                    db.done()
                    resolve(normalize (result.ops[0]))
                })
    
            } catch (ex) {
                reject (ex)
            }
    
        })
    },
    
    async getById(profileId){
        return new Promise(async (resolve, reject)=> {
    
            try {
    
                const db = await mongoHelper.getCollection('profiles')
    
                db.collection.findOne({ _id : new ObjectID(profileId) }, (err, doc) => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))
    
                    db.done()
                    resolve(doc? normalize(doc) : null)
                })
    
            } catch(ex) {
                reject(ex)
            }
    
        })
    },
    
    async getAll(){
        return new Promise(async (resolve, reject) =>{

            try {

                const db = await mongoHelper.getCollection('profiles')
                db.collection.find({ }).toArray((err, docs) => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))

                    const results = []
                    for (let i = 0 ; i < docs.length ; i ++)
                        results.push(normalize(docs[i]))

                    db.done()
                    resolve(results)
                })

            } catch (ex) {
                reject (ex)
            }

        })
    },
    
    async getByIdentifier(identifier){
        return new Promise(async (resolve, reject) => {
            try {
                const db = await mongoHelper.getCollection('profiles')
                db.collection.findOne({ identifier }, (err, doc) => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))
    
                    db.done()
                    resolve(doc? normalize(doc) : null)
                })
    
            } catch (ex) {
                reject (ex)
            }
        })
    },
    
    
    async getByPasswordResetKey(key){
        return new Promise(async (resolve, reject) => {
    
            try {
    
                const db = await mongoHelper.getCollection('profiles')
                db.collection.findOne({ passwordResetKey : key }, (err, doc) => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))
    
                    db.done()
                    resolve(doc? normalize(doc) : null)
                })
    
            } catch (ex) {
                reject (ex)
            }
    
        })
    },
    
    async update(record){
        return new Promise(async (resolve, reject) => {
    
            try {
    
                const db = await mongoHelper.getCollection('profiles'),
                    writeRecord = denormalize(record)

                console.log('upt', writeRecord, record)
                db.collection.updateOne({ _id : writeRecord._id }, { $set: writeRecord }, (err) => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))
    
                    db.done()
                    resolve(record)
                })
    
            } catch (ex) {
                reject (ex)
            }
    
        })
    },
    
    async delete(profile){
        return new Promise(async (resolve, reject) => {
            try {
                const db = await mongoHelper.getCollection('profiles')
                db.collection.deleteOne({ _id : new ObjectID(profile.id) }, err => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))
    
                    db.done()
                    resolve()
    
                })
            } catch(ex) {
                reject(ex)
            }
        })
    }
    
}
