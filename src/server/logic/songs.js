module.exports = {

    /**
     *
     */
    async createMany(songs){
        const constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            songsCache = require(_$+'cache/songs')

        if (!songs || !songs.length)
            throw new Exception({ 
                code : constants.ERROR_INVALID_ARGUMENT, 
                log : 'Songs required' 
            })

        return await songsCache.createMany(songs)
    },


    /**
     * Streams a song from a source like nextcloud
     */
    async streamSong(profileId, mediaPath, res){
        const sourceProvider = require(_$+'sources/provider'),
            source = sourceProvider.getSource()

        await source.streamMedia(profileId, mediaPath, res)
    },


    /**
     *
     */
    async update(song){
        const songsCache = require(_$+'cache/songs')

        return await songsCache.update(song)
    },


    /**
     *
     */
    async deleteForProfile(profileId){
        const songsCache = require(_$+'cache/songs')

        return await songsCache.deleteForProfile(profileId)
    },


    /**
     * song : song object to delete.
     */
    async delete(song){
        const songsCache = require(_$+'cache/songs')

        return await songsCache.delete(song)
    },


    /**
     * Gets all user songs, unfiltered
     */
    async getAll(profileId){
        const songsCache = require(_$+'cache/songs')

        return await songsCache.getAll(profileId)
    },


    /**
     * Presents a way to update song from client using JSON string.
     */
    async persistSong(songRawJson, profileId){
        const constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            JsonHelper = require(_$+'lib/json'),
            songJson = JsonHelper.parse(songRawJson),
            // we check ownership implicitly by fetching song id in scope of current profile
            song = await this.getById(songJson.id, profileId)

        if (!song)
           throw new Exception({ code : constants.ERROR_INVALID_SONG })

        // persist properties that already exist on server, don't trust json from outside to define properties
        for (const property in song)
            song[property] = songJson[property]

        await this.update(song)
    },


    /**
     *
     */
    async getSongUrl(songId, profileId, authTokenId){
        // dont make member, causes cross-import tangle
        const constants = require(_$+'types/constants'),
            sourceProvider = require(_$+'sources/provider'),
            Exception = require(_$+'types/exception'),
            profileLogic = require(_$+'logic/profiles'),
            source = sourceProvider.getSource(),
            profile = await profileLogic.getById(profileId),
            song = await this.getById(songId, profileId)

        if (!profile)
            throw new Exception({ code : constants.ERROR_INVALID_USER_OR_SESSION })

        if (!song)
           throw new Exception({ code : constants.ERROR_INVALID_SONG })

        return await source.getFileLink(profile.sources, profileId, song.path, authTokenId)
    },


    /**
     * 
     */
    async getById(songId, profileId){
        const songsCache = require(_$+'cache/songs'),
            songs = await songsCache.getAll(profileId)
            
        if (!songs.length)
            return null

        return songs.find(song => song.id === songId)
    }
}