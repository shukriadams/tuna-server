module.exports = {
    

    /**
     *
     */    
    normalize(mongoRecord){
        const newRecord = require(_$+'types/authToken').new()

        for (let property in newRecord)
            newRecord[property] = mongoRecord[property]

        if (mongoRecord._id)                
            newRecord.id = mongoRecord._id.toString()
            
        return newRecord
    },

    
    /**
     *
     */    
    denormalize(obj){
        const 
            ObjectID  = require('mongodb').ObjectID,
            clone = Object.assign({}, obj)

        if (obj.id)
            clone._id = new ObjectID(obj.id)

        delete clone.id
        return clone
    },


    /**
     *
     */    
    async create(record){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            newRecord = await mongoCommon.create(`${settings.mongoCollectionPrefix}authTokens`, this.denormalize(record))

        return this.normalize(newRecord)
    },
    
    
    /**
     *
     */
    async delete (id){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings')

        await mongoCommon.delete(`${settings.mongoCollectionPrefix}authTokens`, id)
    },

    
    async deleteForProfile (profileId){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings')

        await mongoCommon.deleteMany(`${settings.mongoCollectionPrefix}authTokens`, { profileId })
    },
    

    /**
     *
     */
    async deleteForContext(profileId, context){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings')

        await mongoCommon.deleteMany(`${settings.mongoCollectionPrefix}authTokens`, {     
            $and: [ 
                { 'profileId' :{ $eq : profileId } },
                { 'context' :{ $eq : context } },
            ]  
        })
    },


    /**
     *
     */    
    async getForProfile(profileId){
        const 
            mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            records = await mongoCommon.find(`${settings.mongoCollectionPrefix}authTokens`, { profileId }),
            results = []

        for (const record of records)
            results.push(this.normalize(record))

        return results
    },
    

    /**
     *
     */
    async getById(id){
        const 
            mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            record = await mongoCommon.findById(`${settings.mongoCollectionPrefix}authTokens`, id)

        return record ? this.normalize(record) : null
    }

}
