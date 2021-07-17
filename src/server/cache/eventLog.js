module.exports = {
    async create(record){
        const data = require(_$+'data/mongo/eventLog')
        return await data.create(record)
    },

    async prune(profileId){
        const data = require(_$+'data/mongo/eventLog')
        await data.prune(profileId)
    },

    async getActive(profileId){
        const data = require(_$+'data/mongo/eventLog')
        return await data.getActive(profileId)
    },

    async getByKey(profile, type, text){
        const data = require(_$+'data/mongo/eventLog')
        return await data.getByKey(profile, type, text)
    },

    async clear(profileId, type){
        const data = require(_$+'data/mongo/eventLog')
        return await data.clear(profileId, type)
    }
}