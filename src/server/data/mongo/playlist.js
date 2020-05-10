const 
    ObjectID = require('mongodb').ObjectID,
    mongoHelper = require(_$+'helpers/mongo'),
    constants = require(_$+'types/constants'),
    Playlist = require(_$+'types/playlist'),
    Exception = require(_$+'types/exception')

function normalize(mongoRecord){
    if (!mongoRecord)
        return null

    let record = Playlist.new()

    for (let property in record)
        if (mongoRecord.hasOwnProperty(property))
            record[property] = mongoRecord[property]

    record.id = mongoRecord._id.toString()
    return record
}

function denormalize(obj, isCreate){
    let clone = {}
    for (let prop in obj)
        clone[prop] = obj[prop]

    if (!obj.id)
        clone._id = new ObjectID(obj.id)

    delete clone.id

    return clone
}

module.exports = {
    
    mongoHelper,

    /**
     * Creates a playlist. Returns the full object created.
     */
    async create(playlist){
        return new Promise(async (resolve, reject)=>{
            try {
                if (!playlist)
                    return reject(new Exception({ log : 'record is blank', code : constants.ERROR_INVALID_ARGUMENT }))

                const db = await mongoHelper.getCollection('playlists')
                
                db.collection.insertOne( playlist, (err, result) =>{
                    if (err || !result.ops.length)
                        return reject(new Exception({ inner: { err, result } }))
    
                    db.done()
                    resolve(normalize(result.ops[0]))
                })
            } catch (ex) {
                reject (ex)
            }
        })
    },


    /**
     *
     */
    async delete(recordId){
        return new Promise(async function promise(resolve, reject){
            try {

                const db = await mongoHelper.getCollection('playlists')

                db.collection.deleteOne({ _id : new ObjectID(recordId) }, function(err) {
                    if (err)
                       return reject(new Exception({ inner: { err } }))

                    db.done()
                    resolve()
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

                const db = await mongoHelper.getCollection('playlists'),
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
    async getForProfile(profileId){
        return new Promise(async (resolve, reject) => {

            try {

                const db = await mongoHelper.getCollection('playlists')
                db.collection.find({ profileId }).toArray( (err, docs) => {
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
    async deleteForProfile(profileId){
        return new Promise(async (resolve, reject) => {
            try {

                const db = await mongoHelper.getCollection('playlists')
                db.collection.deleteMany({ profileId : profileId }, err => {
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

                const db = await mongoHelper.getCollection('playlists')
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