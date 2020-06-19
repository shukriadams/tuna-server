module.exports = {

    /**
     *
     */    
    async create(collection, record){
        const 
            mongoHelper = require(_$+'helpers/mongo'),
            constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception')

        return new Promise(async (resolve, reject)=>{
            try {
    
                if (!record)
                    return reject(new Exception({ log : 'record is blank', code : constants.ERROR_INVALID_ARGUMENT }))

                const db = await mongoHelper.getCollection(collection)
    
                db.collection.insertOne(record, (err, result) => {
                    if (err || !result.ops.length)
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
                const db = await mongoHelper.getCollection(collection),
                    insertRecords = []

                for (const record of records)
                    insertRecords.push(denormalize(record))

                db.collection.insertMany( insertRecords, err => {
                    if (err)
                        return reject(err)

                    db.done()
                    resolve(insertRecords.length)
                })

            } catch (ex) {
                reject (ex)
            }
        })
    },

    async update(collection, id, record){
        const mongoHelper = require(_$+'helpers/mongo')

        return new Promise(async (resolve, reject) => {
            try {

                const db = await mongoHelper.getCollection(collection)

                db.collection.updateOne({ _id : id }, { $set: record }, err => {
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
        const 
            mongoHelper = require(_$+'helpers/mongo'),
            ObjectID  = require('mongodb').ObjectID

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
    
    async deleteAll(collection, query){
        return new Promise(async (resolve, reject) => {
            try {

                const db = await mongoHelper.getCollection(collection)
                db.collection.deleteMany(query, err => {
                    if (err)
                        return reject(err)

                    db.done()
                    resolve()
                })
            } catch(ex) {
                reject(ex)
            }
        })
    },

    async deleteMany(collection, query){
        const 
            mongoHelper = require(_$+'helpers/mongo')

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
        const ObjectID  = require('mongodb').ObjectID

        return this.findOne(collection, { _id : new ObjectID(id) })
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