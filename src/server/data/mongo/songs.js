module.exports = {
    
    normalize(mongoRecord){
        const record = require(_$+'types/song').new()
    
        for (const property in record)
            record[property] = mongoRecord[property]

        if (mongoRecord._id)
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
            settings = require(_$+'lib/settings'),
            insertRecords = []

        for (const song of songs)
            insertRecords.push(this.denormalize(song))

        await mongoCommon.createMany(`${settings.mongoCollectionPrefix}songs`, insertRecords)
    },


    /**
     *
     */
    async update(record){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings'),
            writeRecord = this.denormalize(record)
        
        await mongoCommon.update(`${settings.mongoCollectionPrefix}songs`, record.id, writeRecord)
    },


    /**
     *
     */
    async getAll(profileId){
        const 
            mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings'),
            records = await mongoCommon.find(`${settings.mongoCollectionPrefix}songs`, { profileId }),
            results = []

        for (const record of records)
            results.push(this.normalize(record))

        return results
    },


    /**
     *
     */
    async delete(songId){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings')

        return await mongoCommon.delete(`${settings.mongoCollectionPrefix}songs`, songId)
    },


    /**
     *
     */
    async deleteForProfile(profileId){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings')

        return await mongoCommon.deleteMany(`${settings.mongoCollectionPrefix}songs`, { profileId })
    },


    /**
     *
     */
    async getById(id){
        const 
            mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings'),
            record = await mongoCommon.findById(`${settings.mongoCollectionPrefix}songs`, id)
    
        return record ? this.normalize(record) : null
    }
}