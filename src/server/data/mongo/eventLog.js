module.exports = {
   
    normalize(mongoRecord){
        const record = require(_$+'types/eventLog').new()
    
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
     * Creates an eventLog. Returns the full object created.
     */
    async create(record){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            newRecord = await mongoCommon.create(`${settings.mongoCollectionPrefix}eventLogs`, this.denormalize(record))

        return this.normalize(newRecord)
    },


    /**
     *
     */
    async clear(profileId, type){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings')

        return await mongoCommon.deleteMany(`${settings.mongoCollectionPrefix}eventLogs`, { profileId, type })
    },


    /**
     *
     */
    async getActive(profileId){
        const 
            mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'helpers/settings'),
            records = await mongoCommon.find(`${settings.mongoCollectionPrefix}eventLogs`, [
                { 
                    $match:{
                        $or: [ 
                            {'profileId' :{ $eq : profileId } }
                        ] 
                    }
                },
                
                {
                    $sort : { 'date' : -1 } 
                },
                
                {
                    $group:
                    {
                        "_id":{
                            "code":"$code"
                        },
                        "content": {$first:"$$ROOT"}
                    }
                },

                {
                    $limit : 1
                }              
            ]),
            results = []

        for (const record of records)
            results.push(this.normalize(record))

        return results
    }

}