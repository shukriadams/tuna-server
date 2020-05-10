const 
    mongoHelper = require(_$+'helpers/mongo'),
    constants = require(_$+'types/constants'),
    Exception = require(_$+'types/exception')

function normalize(mongoRecord){
    let system = {}


    for (let property in mongoRecord)
        system[property] = mongoRecord[property]

    delete system._id
    system.id = mongoRecord._id.toString()
    return system
}

function denormalize(obj){
    let clone = {}

    for (let prop in obj)
        clone[prop] = obj[prop]

    if (obj.id)
        clone._id = obj.id

    // never persist password to database
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

                const db = await mongoHelper.getCollection('system'),
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
    
    
    async getById(id){
        return new Promise(async (resolve, reject) =>{
            try {
    
                const db = await mongoHelper.getCollection('system')

                db.collection.findOne({ _id : id }, (err, doc) => {
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
    
                const db = await mongoHelper.getCollection('system')
                    writeRecord = denormalize(record)
    
                db.collection.updateOne({ _id : writeRecord._id }, { $set: writeRecord }, err => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))
    
                    db.done()
    
                    resolve({})
                })
    
            } catch (ex) {
                reject (ex)
            }
        })
    },
    
    
    async delete(record){
        return new Promise(async (resolve, reject) => {
            try {
    
                const db = await mongoHelper.getCollection('system')
                db.collection.deleteOne({ _id : record.id }, err => {
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
