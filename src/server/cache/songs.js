module.exports = {
    
    _getIdKey(profileId){
        return `songs_all_id_${profileId}`  
    },

    async createMany(songs){
        const 
            cache = require(_$+'helpers/cache'),
            songsData = require(_$+'data/mongo/songs'),
            songsCount = await songsData.createMany(songs),
        // assumes there is always at least onc song in collection, logic layer ensures this
            profileId = songs[0].profileId,
            key = this._getIdKey(profileId)

        await cache.remove(key)
        return songsCount
    },


    async getAll(profileId){
        const 
            cache = require(_$+'helpers/cache'),
            JsonHelper = require(_$+'helpers/json'),
            songsData = require(_$+'data/mongo/songs'),
            key = this._getIdKey(profileId),
            songsJson = await cache.get(key)

        if (songsJson)
            return JsonHelper.parse(songsJson)

        const songs = await songsData.getAll(profileId)
        await cache.add(key, JSON.stringify(songs))
        return songs
    },


    async update(song){
        const 
            cache = require(_$+'helpers/cache'),
            songsData = require(_$+'data/mongo/songs'),
            key = this._getIdKey(song.profileId)

        // update song
        song = await songsData.update(song)
        // wipe all user cached songs
        cache.remove(key)

        return song
    },


    async deleteForProfile(profileId){
        const 
            cache = require(_$+'helpers/cache'),
            songsData = require(_$+'data/mongo/songs'),
            key = this._getIdKey(profileId)

        await songsData.deleteForProfile(profileId)
        await cache.remove(key)
    },

    
    async delete(song){
        const
            cache = require(_$+'helpers/cache'),
            songsData = require(_$+'data/mongo/songs'),
            key = this._getIdKey(song.profileId)

        await songsData.delete(song.id)
        await cache.remove(key)
    }

}