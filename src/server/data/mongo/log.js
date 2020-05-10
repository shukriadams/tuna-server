const
    ObjectID  = require('mongodb').ObjectID,
    mongoHelper = require(_$+'helpers/mongo'),
    constants = require(_$+'types/constants'),
    Log = require(_$+'types/log'),
    Exception = require(_$+'types/exception')

function denormalize(obj){
    let clone = Object.assign({}, obj)

    if (obj.id)
        clone._id = new ObjectID(obj.id)
    
    delete clone.id
    return clone
}

function normalize(mongoRecord){
    let newRecord = Log.new()

    for (let property in newRecord)
        if (mongoRecord.hasOwnProperty(property))
            newRecord[property] = mongoRecord[property]

    newRecord.id = mongoRecord._id.toString()
    return newRecord
}



module.exports = {
    
    mongoHelper,

    async create(record){
        return new Promise(async (resolve, reject) =>{
            try {
                if (!record)
                    return reject(new Exception({ log : 'record is blank', code : constants.ERROR_INVALID_ARGUMENT }))

                const db = await mongoHelper.getCollection('logs'),
                    writeRecord = denormalize(record)
    
                db.collection.insertOne(writeRecord, (err, result) => {
                    if (err || !result.ops.length)
                        return reject(new Exception({ inner: { err, result } }))
    
                    db.done()
                    resolve(normalize (result.ops[0]))
                })
    
            } catch (ex) {
                reject(ex)
            }
        })
    }
}