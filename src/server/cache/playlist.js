module.exports = {

     _getKey(profileId){
        return `playlist_all_${profileId}`
    },
    

    async create(playlist){
        const 
            playlistsData = require(_$+'data/mongo/playlist'),
            cache = require(_$+'helpers/cache'),
            newPlaylist = await playlistsData.create(playlist),
            key = this._getKey(newPlaylist.profileId)
    
        await cache.remove(key)
        return newPlaylist
    },
    

    async get(playlistId){
        const playlistsData = require(_$+'data/mongo/playlist')

        return await playlistsData.getById(playlistId)
    },
    
    
    async getAll(profileId){
        let 
            JsonHelper = require(_$+'helpers/json'),
            cache = require(_$+'helpers/cache'),
            playlistsData = require(_$+'data/mongo/playlist'),
            key = this._getKey(profileId),
            playlists = await cache.get(key)
    
        if (playlists)
            return JsonHelper.parse(playlists)
    
        playlists = await playlistsData.getForProfile(profileId)
        await cache.add(key, JSON.stringify(playlists))
        return playlists
    },


    async update(playlist){
        const 
            cache = require(_$+'helpers/cache'),
            playlistsData = require(_$+'data/mongo/playlist')

        await playlistsData.update(playlist)
        await cache.remove(this._getKey(playlist.profileId))
    },
    

    async delete(playlistId, profileId){
        const 
            cache = require(_$+'helpers/cache'),
            playlistsData = require(_$+'data/mongo/playlist')

        await playlistsData.delete(playlistId)
        await cache.remove(this._getKey(profileId))
    },
    
    
    async deleteAll(profileId){
        const 
            cache = require(_$+'helpers/cache'),        
            playlistsData = require(_$+'data/mongo/playlist')

        await playlistsData.deleteForProfile(profileId)
        await cache.remove(this._getKey(profileId))
    }
    
}