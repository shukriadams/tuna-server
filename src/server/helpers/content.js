const
    lastFmHelper = require(_$+'helpers/lastfm'),
    settings = require(_$+'helpers/settings'),
    sourceProvider = require(_$+'helpers/sourceProvider'),
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
            payload = {}

        if (!profile)
            throw new Exception({ code : constants.ERROR_INVALID_USER_OR_SESSION })

        const source = profile.sources[settings.musicSource]

        // return songs only if source is current, else force empty array, even if there are songs in DB.
        // if a source is changed songs from previous source might be present. This isn't likely, but still possible.
        // Songs will be automatically cleared when daemon runs next autoimport
        if (contentRequired.includes('songs'))
            payload.songs = {
                hash : source ? source.indexHash : null, 
                songs : source ? await songsLogic.getAll(profileId) : []
            }

        // NOTE : playlists can contain invalid songs if source has changed and songs from previous source are still in db.
        // Songs will be automatically cleared when daemon runs next autoimport
        if (contentRequired.includes('playlists'))
            payload.playlists = playlistsLogic.getAll(profileId)

        if (contentRequired.includes('profile')){
            payload.session = Session.new()
            payload.session.identifier = profile.identifier
            payload.session.email = profile.email
            payload.session.profileId  = profile.id
            payload.session.isSourceConnected = !!source
            payload.session.sourceOauthUrl = sourceProvider.get().getOauthUrl(authTokenId)
            payload.session.lastfmOauthUrl = lastFmHelper.getOauthUrl(authTokenId)
            payload.session.token = authTokenId
            payload.session.isScrobbling = profile.scrobbleToken !== null
        }

        return payload
    }
}