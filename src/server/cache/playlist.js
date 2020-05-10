const 
    playlistsData = require(_$+'data/mongo/playlist'),
    JsonHelper = require(_$+'helpers/json'),
    cache = require(_$+'helpers/cache')

module.exports = {

     _getKey(profileId){
        return `playlist_all_${profileId}`
    },
    

    async create(playlist){
        playlist = await playlistsData.create(playlist)
    
        // assumes there is always at least onc song in collection, logic layer ensures this
        let key = this._getKey(playlist.profileId)
    
        await cache.remove(key)
        return playlist
    },
    

    async get(playlistId){
        return await playlistsData.getById(playlistId)
    },
    
    
    async getAll(profileId){
        let key = this._getKey(profileId),
            playlists = await cache.get(key)
    
        if (playlists)
            return JsonHelper.parse(playlists)
    
        playlists = await playlistsData.getForProfile(profileId)
        await cache.add(key, JSON.stringify(playlists))
        return playlists
    },


    async update(playlist){
        await playlistsData.update(playlist)
        await cache.remove(this._getKey(playlist.profileId))
    },
    

    async delete(playlistId, profileId){
        await playlistsData.delete(playlistId)
        await cache.remove(this._getKey(profileId))
    },
    
    
    async deleteAll(profileId){
        await playlistsData.deleteForProfile(profileId)
        await cache.remove(this._getKey(profileId))
    }
    
}