module.exports = {

    denormalize(obj){
        const   
            ObjectID  = require('mongodb').ObjectID,
            clone = Object.assign({}, obj)
    
        if (obj.id)
            clone._id = new ObjectID(obj.id)
        
        delete clone.id
        return clone
    },
    
    normalize(mongoRecord){
        const Log = require(_$+'types/log'),
            newRecord = Log.new()
    
        for (let property in newRecord)
            if (mongoRecord.hasOwnProperty(property))
                newRecord[property] = mongoRecord[property]
    
        newRecord.id = mongoRecord._id.toString()
        return newRecord
    },

    async create(record){
        const
            mongoCommon = require(_$+'data/mongo/common'),
            newRecord = await mongoCommon.create('logs', this.denormalize(record))

        return this.normalize(newRecord)        
    }
}