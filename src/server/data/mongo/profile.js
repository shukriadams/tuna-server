module.exports = {
    
    normalize(mongoRecord){
        const profile = require(_$+'types/profile').new()
    
        for (const property in profile)
            if (mongoRecord.hasOwnProperty(property))
                profile[property] = mongoRecord[property]
    
        if (mongoRecord._id)
            profile.id = mongoRecord._id.toString()
            
        return profile
    },
    
    denormalize(obj){
        const ObjectID  = require('mongodb').ObjectID,
            clone = {}
    
        for (const prop in obj)
            clone[prop] = obj[prop]
    
        if (obj.id)
            clone._id = new ObjectID(obj.id)
    
        // never persist these fields to db
        delete clone.id
        delete clone.password
    
        return clone
    },

    async create(record){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            newRecord = await mongoCommon.create(`${settings.mongoCollectionPrefix}profiles`, this.denormalize(record))

        return this.normalize(newRecord)
    },
    
    async getById(id){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            record = await mongoCommon.findById(`${settings.mongoCollectionPrefix}profiles`, id)
        
        return record ? this.normalize(record) : null
    },
    
    async getAll(){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            records = await mongoCommon.find(`${settings.mongoCollectionPrefix}profiles`, { }),
            results = []

        for (const record of records)
            results.push(this.normalize(record))

        return results
    },
    
    async getByIdentifier(identifier){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            record = await mongoCommon.findOne(`${settings.mongoCollectionPrefix}profiles`, { identifier })

        return record ? this.normalize(record) : null
    },
    
    async getByPasswordResetKey(key){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            record = await mongoCommon.findOne(`${settings.mongoCollectionPrefix}profiles`, { passwordResetKey : key })

        return record ? this.normalize(record) : null
    },
    
    async update(profile){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            writeProfile = this.denormalize(profile)
        
        await mongoCommon.update(`${settings.mongoCollectionPrefix}profiles`, profile.id, writeProfile)
    },
    
    async delete(profile){
        const mongoCommon = require(_$+'data/mongo/common')
            settings = require(_$+'helpers/settings')
            
        return await mongoCommon.delete(`${settings.mongoCollectionPrefix}profiles`, profile.id)
    }
    
}
