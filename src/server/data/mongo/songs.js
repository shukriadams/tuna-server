let 
    ObjectID = require('mongodb').ObjectID,
    mongoHelper = require(_$+'helpers/mongo'),
    Exception = require(_$+'types/exception')

function normalize(mongoRecord){
    if (!mongoRecord)
        return null

    let Song = require(_$+'types/song') // this is binding to playlist factory!?!?!?!
    let record = Song.new()


    for (let property in record)
        if (mongoRecord.hasOwnProperty(property))
            record[property] = mongoRecord[property]

    record.id = mongoRecord._id.toString()
    return record
}

function denormalize(obj){
    let clone = {}

    for (let prop in obj)
        clone[prop] = obj[prop]

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
    async createMany(songs){
        return new Promise(async (resolve, reject) => {
            try {
                const db = await mongoHelper.getCollection('songs'),
                    insertRecords = []

                for (let i = 0 ; i < songs.length ; i ++)
                    insertRecords.push(denormalize(songs[i], true))

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


    /**
     *
     */
    async update(record){
        return new Promise(async (resolve, reject) => {

            try {

                const db = await mongoHelper.getCollection('songs')
                    writeRecord = denormalize(record, false)

                db.collection.updateOne({ _id : writeRecord._id }, { $set: writeRecord }, err => {
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


    /**
     *
     */
    async getAll(profileId){
        return new Promise(async (resolve, reject) => {

            try {

                const db = await mongoHelper.getCollection('songs')

                db.collection.find({ profileId }).toArray((err, docs) => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))

                    let results = []
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


    /**
     *
     */
    async delete(songId){
        return new Promise(async (resolve, reject) => {
            try {

                const db = await mongoHelper.getCollection('songs')
                db.collection.deleteOne({_id : new ObjectID(songId) }, err => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))

                    db.done()
                    resolve()

                })
            } catch(ex) {
                reject(ex)
            }
        })
    },


    /**
     *
     */
    async deleteAll(profileId){
        return new Promise(async (resolve, reject) => {
            try {

                const db = await mongoHelper.getCollection('songs')
                db.collection.deleteMany({ profileId }, err => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))

                    db.done()
                    resolve()
                })
            } catch(ex) {
                reject(ex)
            }
        })
    },


    /**
     *
     */
    async getById(songId){
        return new Promise(async (resolve, reject) => {

            try {

                const db = await mongoHelper.getCollection('songs')
                db.collection.findOne({ _id : new ObjectID(songId) }, (err, doc) => {
                    if (err)
                        return reject(new Exception({ inner: { err } }))

                    db.done()
                    resolve(normalize(doc))
                })

            } catch(ex) {
                reject(ex)
            }

        })
    }
}