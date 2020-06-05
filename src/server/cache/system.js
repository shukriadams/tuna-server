module.exports = {

    _getIdKey(recordId){
        return `system_id_${recordId}` 
    },
    

    async getById(recordId){
        const 
            systemData = require(_$+'data/mongo/system'),
            JsonHelper = require(_$+'helpers/json'),
            cache = require(_$+'helpers/cache'),
            key = this._getIdKey(recordId)
            reply = await cache.get(key)
    
        if (reply)
            return (JsonHelper.parse(reply))
    
        let record = await systemData.getById(recordId)
        if (record)
            await cache.add(key, JSON.stringify(record))
    
        return record
    },
    

    async create(record){
        const 
            systemData = require(_$+'data/mongo/system'),
            cache = require(_$+'helpers/cache'),
            newRecord = await systemData.create(record),
            key = this._getIdKey(newRecord.id)

        await cache.add(key, JSON.stringify(newRecord))
        return newRecord
    },
    

    async getById(id){
        const systemData = require(_$+'data/mongo/system')

        return systemData.getById(id)
    },
    

    async update(record){
        const 
            systemData = require(_$+'data/mongo/system'),
            cache = require(_$+'helpers/cache')

        await systemData.update(record)
        const key = this._getIdKey(record.id)
        await cache.add(key, JSON.stringify(record))
    },
    

    async delete(record){
        const 
            systemData = require(_$+'data/mongo/system'),
            cache = require(_$+'helpers/cache')

        await systemData.delete(record)
        const key = this._getIdKey(record.id)
        await cache.remove(key)
    }
}