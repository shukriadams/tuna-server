module.exports = {

    /**
     *
     */
    async create(playlist, profileId){
        const 
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            settings = require(_$+'helpers/settings'),
            playlistsCache = require(_$+'cache/playlist')

        if (settings.demoMode)
            return

        if (!playlist)
            throw new Exception({ code: constants.ERROR_INVALID_ARGUMENT, log : 'playlist required' })

        if (!profileId)
            throw new Exception({ code: constants.ERROR_INVALID_ARGUMENT, log : 'profileId required' })

        if (!playlist.name)
            throw new Exception({ code: constants.ERROR_INVALID_ARGUMENT, log : 'name required' })

        playlist.profileId = profileId
        playlist.name = playlist.name.substr(0, 25) // limit playlist name length

        await playlistsCache.create(playlist)
    },


    /**
     *
     */
    async update(playlist){
        const 
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            settings = require(_$+'helpers/settings'),
            playlistsCache = require(_$+'cache/playlist')

        if (settings.demoMode)
            return            

        if (!playlist)
            throw new Exception({ code: constants.ERROR_INVALID_ARGUMENT, log : 'playlist required' })

        if (!playlist.profileId)
            throw new Exception({ code: constants.ERROR_INVALID_ARGUMENT, log : 'profileId required' })

        if (!playlist.name)
            throw new Exception({ code: constants.ERROR_INVALID_ARGUMENT, log : 'name required' })

        // force name length
        playlist.name = playlist.name.substr(0, 25)

        await playlistsCache.update(playlist)
    },


    /**
     *
     */
    async delete(playlistId, profileId){
        const playlistsCache = require(_$+'cache/playlist'),
            settings = require(_$+'helpers/settings')
            
        if (settings.demoMode)
            return            

        await playlistsCache.delete(playlistId, profileId)
    },


    /**
     *
     */
    async deleteAll(profileId){
        const playlistsCache = require(_$+'cache/playlist')

        return await playlistsCache.deleteAll(profileId)
    },


    /**
     *
     */
    async getAll(profileId){
        const playlistsCache = require(_$+'cache/playlist')
        return await playlistsCache.getAll(profileId)
    }

}