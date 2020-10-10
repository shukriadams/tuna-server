module.exports = {
    
    normalize(mongoRecord){
        const playlog = require(_$+'types/playlog').new()
    
        for (const property in playlog)
            playlog[property] = mongoRecord[property]

        if (mongoRecord._id)
            playlog.id = mongoRecord._id.toString()
            
        return playlog
    },
    
    denormalize(obj){
        const ObjectID = require('mongodb').ObjectID,
            clone = {}
    
        for (const prop in obj)
            clone[prop] = obj[prop]
    
        if (obj.id)
            clone._id = new ObjectID(obj.id)
    
        // never persist these fields to db
        delete clone.id
    
        return clone
    },

    async create(record){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            newRecord = await mongoCommon.create(`${settings.mongoCollectionPrefix}playlogs`, this.denormalize(record))

        return this.normalize(newRecord)
    },
    
    async page(page, pageSize){
        let mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            records = await mongoCommon.find(`${settings.mongoCollectionPrefix}playlogs`, { }),
            results = []

        records  = records.slice(page * pageSize, (page * pageSize) + pageSize)

        for (const record of records)
            results.push(this.normalize(record))

        return results
    },
    
    async deleteAll(profileId){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings')
            
        return await mongoCommon.deleteMany(`${settings.mongoCollectionPrefix}playlogs`, profileId)
    },

    /**
     *
     */
    async delete(id){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings')

        return await mongoCommon.delete(`${settings.mongoCollectionPrefix}playlogs`, id)
    }
    
}
