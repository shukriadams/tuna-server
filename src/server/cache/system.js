const 
    systemData = require(_$+'data/mongo/system'),
    JsonHelper = require(_$+'helpers/json'),
    cache = require(_$+'helpers/cache')

module.exports = {

    _getIdKey(recordId){
        return `system_id_${recordId}` 
    },
    

    async getById(recordId){
        let key = this._getIdKey(recordId)
        let reply = await cache.get(key)
    
        if (reply)
            return (JsonHelper.parse(reply))
    
        let record = await systemData.getById(recordId)
        if (record)
            await cache.add(key, JSON.stringify(record))
    
        return record
    },
    

    async create(record){
        record = await systemData.create(record)
        let key = this._getIdKey(record.id)
        await cache.add(key, JSON.stringify(record))
        return record
    },
    

    async getById(id){
        return systemData.getById(id)
    },
    

    async update(record){
        await systemData.update(record)
        let key = this._getIdKey(record.id)
        await cache.add(key, JSON.stringify(record))
    },
    

    async delete(record){
        await systemData.delete(record)
        let key = this._getIdKey(record.id)
        await cache.remove(key)
    }
}