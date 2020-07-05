module.exports = {
    

    /**
     *
     */    
    normalize(mongoRecord){
        const 
            AuthToken = require(_$+'types/authToken'),
            newRecord = AuthToken.new()

        for (let property in newRecord)
            if (mongoRecord.hasOwnProperty(property))
                newRecord[property] = mongoRecord[property]

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
            newRecord = await mongoCommon.create('authTokens', this.denormalize(record))

        return this.normalize(newRecord)
    },
    
    
    /**
     *
     */
    async delete (id){
        const mongoCommon = require(_$+'data/mongo/common')
        await mongoCommon.delete('authTokens', id)
    },

    
    async deleteForProfile (profileId){
        const mongoCommon = require(_$+'data/mongo/common')
        await mongoCommon.deleteMany('authTokens', { profileId })
    },
    

    /**
     *
     */
    async deleteForContext(profileId, context){
        const mongoCommon = require(_$+'data/mongo/common')

        await mongoCommon.deleteMany('authTokens', {     
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
            records = await mongoCommon.find('authTokens', { profileId }),
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
            record = await mongoCommon.findById('authTokens', id)

        return record ? this.normalize(record) : null
    }

}
