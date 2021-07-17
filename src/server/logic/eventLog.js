module.exports = {

    /**
     * 
     */
    async prune(profileId){
        const cache = require(_$+'cache/eventLog')
        
        await cache.prune(profileId)
    },

    /**
     * 
     */
    async create(profileId, code, context, text){
        const cache = require(_$+'cache/eventLog'),
            Type = require(_$+'types/eventLog'),
            record = Type.new()

        record.type = code
        record.profileId = profileId
        record.text = text
        record.context = context
        record.date = new Date().getTime()

        return await cache.create(record)
    },


    /**
     * 
     */
    async getActive(profileId){
        const cache = require(_$+'cache/eventLog')

        return await cache.getActive(profileId)
    },


    /**
     * 
     */
    async clear(profileId, type){
        const cache = require(_$+'cache/eventLog')

        return await cache.clear(profileId, type)
    }

}