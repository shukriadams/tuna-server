module.exports = {

    /**
     * Logs song play with whatever ways that can be done
     */
    async playing (profileId, songId){
        const constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            playlog = require(_$+'logic/playlog'),
            profileLogic = require(_$+'logic/profiles'),
            songsLogic = require(_$+'logic/songs'),
            settings = require(_$+'lib/settings'),
            profile = await profileLogic.getById(profileId),
            song = await songsLogic.getById(songId, profileId),
            lastFmHelper = require(_$+'lib/lastfm')

        if (!profile)
                throw new Exception({ code: constants.ERROR_INVALID_USER_OR_SESSION })
    
        if (!song)
            throw new Exception({ code: constants.ERROR_INVALID_SONG })

        if (settings.logPlays)
            await playlog.create(profileId, song.id, song.name, song.artist, song.album)

        await lastFmHelper.nowPlaying(profile, song)
    },

    /**
     * Logs that a song has played in whatever way is needed.
     */
    async played(profileId, songId, songDuration){
        const constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            profileLogic = require(_$+'logic/profiles'),
            songsLogic = require(_$+'logic/songs'),
            lastFmHelper = require(_$+'lib/lastfm'),
            settings = require(_$+'lib/settings'),
            cache = require(_$+'lib/cache'),
            song = await songsLogic.getById(songId, profileId)

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

        if (profile.scrobbleToken){
            const unixStart = Math.round(+nowPlaying.started / 1000)
            await lastFmHelper.scrobble(profile, song, unixStart)
            __log.info(`user ${profileId} track ${songId} scrobbled after ${elapsedSeconds} seconds`)
        }

        await cache.remove( cacheKey )
        return true
    },
}