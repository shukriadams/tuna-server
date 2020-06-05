module.exports = {

    /**
     *
     */
    async create(record){
        const systemCache = require(_$+'cache/system')
        return await systemCache.create(record);
    },


    /**
     *
     */
    async update(record){
        const systemCache = require(_$+'cache/system')
        return await systemCache.update(record);
    },


    /**
     *
     */
    async delete (record){
        const systemCache = require(_$+'cache/system')
        return await systemCache.delete(record);
    },


    /**
     *
     */
    async getById(id){
        const systemCache = require(_$+'cache/system')
        return await systemCache.getById(id);
    }
};