module.exports = {
   
    normalize(mongoRecord){
        if (!mongoRecord)
            return mongoRecord
            
        const record = require(_$+'types/eventLog').new()
    
        for (const property in record)
            record[property] = mongoRecord[property]

        if (mongoRecord._id)
            record.id = mongoRecord._id.toString()
            
        return record
    },
    
    denormalize(obj){
        const ObjectID = require('mongodb').ObjectID,
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
            settings = require(_$+'lib/settings'),
            newRecord = await mongoCommon.create(`${settings.mongoCollectionPrefix}eventLogs`, this.denormalize(record))

        return this.normalize(newRecord)
    },


    /**
     *
     */
    async clear(profileId, type){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings')

        return await mongoCommon.deleteMany(`${settings.mongoCollectionPrefix}eventLogs`, { profileId, type })
    },


    async getByKey(profile, type, text){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings')

        const record = await mongoCommon.find(`${settings.mongoCollectionPrefix}eventLogs`, { profile, type, text })
        return this.normalize(record)
    },


    /**
     *
     */
    async prune(profileId){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings'),
            groups = await mongoCommon.aggregate(`${settings.mongoCollectionPrefix}eventLogs`, [
                { 
                    $match:{
                        $and: [ 
                            {'profileId' :{ $eq : profileId } }
                        ] 
                    }
                },
                
                // sort newest first
                {
                    $sort : { 'date' : -1 } 
                },
                
                // allow 10 newest
                {
                    $skip : 10
                },

                {
                    $group:
                    {
                        _id : {
                            type: "$type"
                        },
                        content: { $first: "$$ROOT" }
                    }
                }
            ])

        for (const group of groups){
            await mongoCommon.deleteMany(`${settings.mongoCollectionPrefix}eventLogs`, 
                { 
                    $and: [ 
                        { profileId :{ $eq : profileId } },
                        { date : { $lt : group.content.date } },
                        { type: { $eq : group.content.type }}
                    ] 
                }
            )
            
        }
    },


    /**
     *
     */
    async getActive(profileId){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings'),
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
                            "type":"$type"
                        },
                        "content": { $first:"$$ROOT" }
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