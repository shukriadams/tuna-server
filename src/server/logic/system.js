let systemCache = require(_$+'cache/system')

module.exports = {

    /**
     *
     */
    async create(record){
        return await systemCache.create(record);
    },


    /**
     *
     */
    async update(record){
        return await systemCache.update(record);
    },


    /**
     *
     */
    async delete (record){
        return await systemCache.delete(record);
    },


    /**
     *
     */
    async getById(id){
        return await systemCache.getById(id);
    }
};