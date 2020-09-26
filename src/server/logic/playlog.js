module.exports = {
    async create(profileId, songId, name, artist, album){
        const playlogCache = require(_$+'cache/playlog'),
            Playlog = require(_$+'types/playlog')
            playlog = Playlog.new()

        playlog.name = name
        playlog.artist = artist
        playlog.album = album
        playlog.profileId = profileId
        playlog.songId = songId
        playlog.date = new Date().getTime()

        return await playlogCache.create(playlog)
    },

    async page(page, pageSize){
        const playlogCache = require(_$+'cache/playlog')
        return await playlogCache.page(page, pageSize)
    },

    async deleteAll(profile){
        const playlogCache = require(_$+'cache/playlog')
        return await playlogCache.deleteAll(profile)
    },

    async delete(id){
        const playlogCache = require(_$+'cache/playlog')
        return await playlogCache.delete(id)
    }
}