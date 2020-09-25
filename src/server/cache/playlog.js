module.exports = {
    async create(record){
        const playlogData = require(_$+'data/mongo/playlog')
        return await playlogData.create(record)
    },

    async page(page, pageSize){
        const playlogData = require(_$+'data/mongo/playlog')
        return await playlogData.page(page, pageSize)
    },

    async deleteAll(profile){
        const playlogData = require(_$+'data/mongo/playlog')
        return await playlogData.deleteAll(profile)
    },

    async delete(id){
        const playlogData = require(_$+'data/mongo/playlog')
        return await playlogData.delete(id)
    }
}