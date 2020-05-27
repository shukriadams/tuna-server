const
    crypto = require('crypto'),
    settings = require(_$+'helpers/settings'),
    playlistsLogic = require(_$+'logic/playlists'),
    profileLogic = require(_$+'logic/profiles'),
    Exception = require(_$+'types/exception'),
    constants = require(_$+'types/constants'),
    Session = require(_$+'types/session'),
    songsLogic = require(_$+'logic/songs')

module.exports = {

    /**
     * contentRequired: comma-separatd string
     */
    async build(profileId, authTokenId, contentRequired){
        const profile = await profileLogic.getById(profileId)
        if (!profile)
            throw new Exception({ code : constants.ERROR_INVALID_USER_OR_SESSION })

        const source = profile.sources[settings.musicSource],
            session = Session.new()
        
        session.hash = source ? source.indexHash : ''

        // return songs only if source is current, else force empty array, even if there are songs in DB.
        // if a source is changed songs from previous source might be present. This isn't likely, but still possible.
        // Songs will be automatically cleared when daemon runs next autoimport
        if (contentRequired.includes('songs'))
            session.songs = source ? await songsLogic.getAll(profileId) : []

        // NOTE : playlists can contain invalid songs if source has changed and songs from previous source are still in db.
        // Songs will be automatically cleared when daemon runs next autoimport
        const playlists = await playlistsLogic.getAll(profileId)
        session.hash += crypto.createHash('md5').update(JSON.stringify(playlists), 'utf8').digest('hex')
        if (contentRequired.includes('playlists'))
            session.playlists = playlists

        session.hash += profile.hash
        session.hash = crypto.createHash('md5').update(session.hash, 'utf8').digest('hex')

        if (contentRequired.includes('profile')){
            session.identifier = profile.identifier
            session.email = profile.email
            session.profileId  = profile.id
            session.isSourceConnected = !!source
            session.token = authTokenId
            session.isScrobbling = profile.scrobbleToken !== null
        }

        return session
    }
}