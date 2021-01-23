module.exports = {
    async create(record){
        const data = require(_$+'data/mongo/eventLog')
        return await data.create(record)
    },

    async getActive(profileId){
        const data = require(_$+'data/mongo/eventLog')
        return await data.getActive(profileId)
    },

    async clear(profileId, type){
        const data = require(_$+'data/mongo/eventLog')
        return await data.clear(profileId, type)
    }
}