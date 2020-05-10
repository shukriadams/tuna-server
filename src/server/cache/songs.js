const 
    songsData = require(_$+'data/mongo/songs'),
    JsonHelper = require(_$+'helpers/json'),
    cache = require(_$+'helpers/cache')

module.exports = {
    
    _getIdKey(profileId){
        return 'songs_all_id_' + profileId
    },

    async createMany(songs){
        let songsCount = await songsData.createMany(songs)

        // assumes there is always at least onc song in collection, logic layer ensures this
        let profileId = songs[0].profileId,
            key = this._getIdKey(profileId)

        await cache.remove(key)
        return songsCount
    },


    async getAll(profileId){
        let key = this._getIdKey(profileId),
            songsJson = await cache.get(key)

        if (songsJson)
            return JsonHelper.parse(songsJson)

        let songs = await songsData.getAll(profileId)
        await cache.add(key, JSON.stringify(songs))
        return songs
    },


    async update(song){

        // update song
        song = await songsData.update(song)

        // wipe user cached songs
        let key = this._getIdKey(song.profileId)
        cache.remove(key)

        return song
    },


    async deleteAll(profileId){
        await songsData.deleteAll(profileId)
        let key = this._getIdKey(profileId)
        await cache.remove(key)
    },

    
    async delete(song){
        await songsData.delete(song.id)
        let key = this._getIdKey(song.profileId)
        await cache.remove(key)
    }

}