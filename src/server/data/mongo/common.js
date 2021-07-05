module.exports = {

    /**
     *
     */    
    async create(collection, record){
        const mongoHelper = require(_$+'helpers/mongo'),
            constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception')

        return new Promise(async (resolve, reject)=>{
            try {
    
                if (!record)
                    return reject(new Exception({ log : 'record is blank', code : constants.ERROR_INVALID_ARGUMENT }))

                const db = await mongoHelper.getCollection(collection)
    
                db.collection.insertOne(record, (err, result) => {
                    if (err)
                        return reject(err)
                        
                    db.done()
                    resolve(result.ops[0])
                })
    
            } catch (ex){
                reject(ex)
            }
        })
    },

    async createMany(collection, records){
        const mongoHelper = require(_$+'helpers/mongo')

        return new Promise(async (resolve, reject) => {
            try {
                const db = await mongoHelper.getCollection(collection)

                db.collection.insertMany( records, err => {
                    if (err)
                        return reject(err)

                    db.done()
                    resolve(records.length)
                })

            } catch (ex) {
                reject (ex)
            }
        })
    },

    async update(collection, id, record){
        const mongoHelper = require(_$+'helpers/mongo'),
            ObjectID = require('mongodb').ObjectID

        return new Promise(async (resolve, reject) => {
            try {

                const db = await mongoHelper.getCollection(collection)

                db.collection.updateOne({ _id : new ObjectID(id)  }, { $set: record }, err => {
                    if (err)
                        return reject(err)

                    db.done()
                    resolve()
                })

            } catch (ex) {
                reject (ex)
            }
        })
    },

    async delete (collection, id){
        const mongoHelper = require(_$+'helpers/mongo'),
            ObjectID = require('mongodb').ObjectID

        return new Promise(async (resolve, reject) => {
    
            try {
                const db = await mongoHelper.getCollection(collection)
    
                db.collection.deleteOne({ _id : new ObjectID(id) }, err => {
                    if (err)
                        return reject(err)
    
                    db.done()
                    resolve()
                })
    
            } catch (ex){
                reject(ex)
            }
    
        })
    },
    
    async deleteMany(collection, query){
        const mongoHelper = require(_$+'helpers/mongo')

        return new Promise(async (resolve, reject) => {
    
            try {
                const db = await mongoHelper.getCollection(collection)
    
                db.collection.deleteMany(query, err => {
                    if (err)
                        return reject(err)
    
                    db.done()
                    resolve()
                })
    
            } catch (ex){
                reject(ex)
            }
        })
    },

    async find(collection, query){
        const mongoHelper = require(_$+'helpers/mongo')

        return new Promise(async (resolve, reject) => {
            try {
                const db = await mongoHelper.getCollection(collection)
    
                db.collection.find(query).toArray((err, docs) => {
                    if (err)
                        return reject(err)
    
                    db.done()
                    resolve(docs)
                })
    
            } catch (ex){
                reject(ex)
            }
        })
    },

    async findById(collection, id){
        let ObjectID  = require('mongodb').ObjectID,
            objId 

        try {
            objId = new ObjectID(id)
        } catch {
            // invalid id, we don't care about exception
            return null
        }

        return await this.findOne(collection, { _id : objId })
    },

    async findOne(collection, query){
        const mongoHelper = require(_$+'helpers/mongo')

        return new Promise(async (resolve, reject) => {
    
            try {
                const db = await mongoHelper.getCollection(collection)
    
                db.collection.findOne(query, (err, doc) => {
                    if (err)
                        return reject(err)
    
                    db.done()
                    resolve(doc)
                })
    
            } catch (ex){
                reject(ex)
            }
    
        })
    }

}