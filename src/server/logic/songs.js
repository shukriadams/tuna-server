module.exports = {

    /**
     *
     */
    async createMany(songs){
        const 
            constants = require(_$+'types/constants'),
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
        const sourceProvider = require(_$+'helpers/sourceProvider'),
            source = sourceProvider.get()

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
     *
     */
    async nowPlaying(profileId, songId){
        const 
            constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            lastFmHelper = require(_$+'helpers/lastfm'),
            profileLogic = require(_$+'logic/profiles'),
            profile = await profileLogic.getById(profileId)

        if (!profile)
            throw new Exception({ code: constants.ERROR_INVALID_USER_OR_SESSION })

        const song = await this._getById(songId, profileId)

        if (!song)
            throw new Exception({ code: constants.ERROR_INVALID_SONG })

        return await lastFmHelper.nowPlaying(profile, song)
    },


    /**
     * Move to lastfm helper
     */
    async scrobble(profileId, songId, songDuration){
        const 
            constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            profileLogic = require(_$+'logic/profiles'),
            lastFmHelper = require(_$+'helpers/lastfm'),
            settings = require(_$+'helpers/settings'),
            logger = require('winston-wrapper').instance(settings.logPath),
            cache = require(_$+'helpers/cache'),
            song = await this._getById(songId, profileId)

        if (settings.demoMode)
            return false

        if (!song)
            throw new Exception({ code: constants.ERROR_INVALID_SONG })

        const cacheKey = `${profileId}_nowPlaying`,
            nowPlaying = await cache.get(cacheKey)

        // song may have already been scrobbled
        if (!nowPlaying)
            return false

        if (nowPlaying.songId !== songId)
            throw new Exception({ 
                log : 'playSession contains a different song',
                inner : {
                    playSession :nowPlaying,
                    songId
                }
            })        

        // duration logic not working yet, disabling for now
        const halfWayPointInSeconds = /*songDuration ? songDuration / 2 : song.duration ? (song.duration / 2) :*/ 30, // 30 bein lastfm minimum scrobble time
            diff = new Date().getTime() - nowPlaying.started,
            elapsedSeconds = diff / 1000

        // pre half-time scrobble attempt, ignore
        if (elapsedSeconds < halfWayPointInSeconds)
            return false 

        const profile = await profileLogic.getById(profileId)

        if (!profile)
            throw new Exception({ code : constants.ERROR_INVALID_USER_OR_SESSION })

        if (!profile.scrobbleToken)
            throw new Exception({ log : 'profile not scrobbling'})

        const unixStart = Math.round(+nowPlaying.started / 1000)
        await lastFmHelper.scrobble(profile, song, unixStart)
        await cache.remove( cacheKey )
        
        logger.info.info(`user ${profileId} track ${songId} scrobbled after ${elapsedSeconds} seconds`)

        return true
    },


    /**
     * Presents a way to update song from client using JSON string.
     */
    async persistSong(songRawJson, profileId){
        const 
            constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            JsonHelper = require(_$+'helpers/json'),
            songJson = JsonHelper.parse(songRawJson),
            // we check ownership implicitly by fetching song id in scope of current profile
            song = await this._getById(songJson.id, profileId)

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
        const 
            constants = require(_$+'types/constants'),
            sourceProvider = require(_$+'helpers/sourceProvider'),
            Exception = require(_$+'types/exception'),
            profileLogic = require(_$+'logic/profiles'),
            source = sourceProvider.get(),
            profile = await profileLogic.getById(profileId),
            song = await this._getById(songId, profileId)

        if (!profile)
            throw new Exception({ code : constants.ERROR_INVALID_USER_OR_SESSION })

        if (!song)
           throw new Exception({ code : constants.ERROR_INVALID_SONG })

        return await source.getFileLink(profile.sources, song.path, authTokenId)
    },


    /**
     * 
     */
    async  _getById(songId, profileId){
        const songsCache = require(_$+'cache/songs')

        // we fetch all songs for user because content is cached at the user level
        const songs = await songsCache.getAll(profileId)
        if (!songs.length)
            return null

        return songs.find(song => song.id === songId)
    }
}