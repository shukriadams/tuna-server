module.exports = {
   
    normalize(mongoRecord){
        const Playlist = require(_$+'types/playlist')

        if (!mongoRecord)
            return null
    
        const record = Playlist.new()
    
        for (const property in record)
            if (mongoRecord.hasOwnProperty(property))
                record[property] = mongoRecord[property]
    
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
            newPlaylist = await mongoCommon.create('playlists', this.denormalize(playlist))

        return this.normalize(newPlaylist)
    },


    /**
     *
     */
    async delete(id){
        const mongoCommon = require(_$+'data/mongo/common')
        return await mongoCommon.delete('playlists', id)
    },


    /**
     *
     */
    async update(playlist){
        const mongoCommon = require(_$+'data/mongo/common'),
            writePlaylist = this.denormalize(playlist)
        
        await mongoCommon.update('playlists', playlist.id, writePlaylist)
    },


    /**
     *
     */
    async getForProfile(profileId){
        const 
            mongoCommon = require(_$+'data/mongo/common'),
            records = await mongoCommon.find('playlists', { profileId }),
            results = []

        for (const record of records)
            results.push(this.normalize(record))

        return results
    },


    /**
     *
     */
    async deleteForProfile(profileId){
        const mongoCommon = require(_$+'data/mongo/common')
        return await mongoCommon.deleteMany('authTokens', { profileId })
    },


    /**
     *
     */
    async getById(id){
        const 
            mongoCommon = require(_$+'data/mongo/common'),
            record = await mongoCommon.findById('playlists', id)

        return record ? this.normalize(record) : null
    }
}