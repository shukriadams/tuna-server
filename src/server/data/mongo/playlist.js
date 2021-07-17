module.exports = {
   
    normalize(mongoRecord){
        const record = require(_$+'types/playlist').new()
    
        for (const property in record)
            record[property] = mongoRecord[property]

        if (mongoRecord._id)
            record.id = mongoRecord._id.toString()
            
        return record
    },
    
    denormalize(obj){
        const 
            ObjectID = require('mongodb').ObjectID,
            clone = {}

        for (const prop in obj)
            clone[prop] = obj[prop]
    
        if (obj.id)
            clone._id = new ObjectID(obj.id)
    
        delete clone.id
    
        return clone
    },

    
    /**
     * Creates a playlist. Returns the full object created.
     */
    async create(playlist){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings'),
            newPlaylist = await mongoCommon.create(`${settings.mongoCollectionPrefix}playlists`, this.denormalize(playlist))

        return this.normalize(newPlaylist)
    },


    /**
     *
     */
    async delete(id){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings')

        return await mongoCommon.delete(`${settings.mongoCollectionPrefix}playlists`, id)
    },


    /**
     *
     */
    async update(playlist){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings'),
            writePlaylist = this.denormalize(playlist)
        
        await mongoCommon.update(`${settings.mongoCollectionPrefix}playlists`, playlist.id, writePlaylist)
    },


    /**
     *
     */
    async getForProfile(profileId){
        const 
            mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings'),
            records = await mongoCommon.find(`${settings.mongoCollectionPrefix}playlists`, { profileId }),
            results = []

        for (const record of records)
            results.push(this.normalize(record))

        return results
    },


    /**
     *
     */
    async deleteForProfile(profileId){
        const mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings')

        return await mongoCommon.deleteMany(`${settings.mongoCollectionPrefix}playlists`, { profileId })
    },


    /**
     *
     */
    async getById(id){
        const 
            mongoCommon = require(_$+'data/mongo/common'),
            settings = require(_$+'lib/settings'),
            record = await mongoCommon.findById(`${settings.mongoCollectionPrefix}playlists`, id)

        return record ? this.normalize(record) : null
    }
}