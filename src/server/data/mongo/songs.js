module.exports = {
    
    normalize(mongoRecord){
        if (!mongoRecord)
            return null
    
        const Song = require(_$+'types/song'), // this is binding to playlist factory!?!?!?!
            record = Song.new()
    
    
        for (const property in record)
            if (mongoRecord.hasOwnProperty(property))
                record[property] = mongoRecord[property]
    
        record.id = mongoRecord._id.toString()
        return record
    },
    
    denormalize(obj){
        const
            ObjectID = require('mongodb').ObjectID,
            clone = {}
    
        for (const prop in obj)
            clone[prop] = obj[prop]
    
        if (obj.id)
            clone._id = new ObjectID(obj.id)
    
        delete clone.id
        return clone
    },


    /**
     *
     */
    async createMany(songs){
        const mongoCommon = require(_$+'data/mongo/common'),
            insertRecords = []

        for (const song of songs)
            insertRecords.push(this.denormalize(song))

        await mongoCommon.createMany('songs', insertRecords)
    },


    /**
     *
     */
    async update(record){
        const mongoCommon = require(_$+'data/mongo/common'),
            writeRecord = this.denormalize(record)
        
        await mongoCommon.update('songs', record._id, writeRecord)
    },


    /**
     *
     */
    async getAll(profileId){
        const 
            mongoCommon = require(_$+'data/mongo/common'),
            records = await mongoCommon.find('songs', { profileId }),
            results = []

        for (const record of records)
            results.push(this.normalize(record))

        return results
    },


    /**
     *
     */
    async delete(songId){
        const mongoCommon = require(_$+'data/mongo/common')
        return await mongoCommon.delete('songs', songId)
    },


    /**
     *
     */
    async deleteAll(profileId){
        const mongoCommon = require(_$+'data/mongo/common')
        return await mongoCommon.deleteMany('songs', { profileId })
    },


    /**
     *
     */
    async getById(id){
        const 
            mongoCommon = require(_$+'data/mongo/common'),
            record = await mongoCommon.findById('songs', id)
    
        return record ? this.normalize(record) : null
    }
}