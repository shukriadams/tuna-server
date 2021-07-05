module.exports = {

    /**
     * contentRequired: comma-separatd string
     */
    async build(profileId, authTokenId, contentRequired){
        const crypto = require('crypto'),
            settings = require(_$+'helpers/settings'),
            playlistsLogic = require(_$+'logic/playlists'),
            profileLogic = require(_$+'logic/profiles'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            Session = require(_$+'types/session'),
            eventLogLogic = require(_$+'logic/eventLog'),
            profile = await profileLogic.getById(profileId)

        if (!profile)
            throw new Exception({ code : constants.ERROR_INVALID_USER_OR_SESSION })

        const source = profile.sources[settings.musicSource],
            session = Session.new()
        
        session.hash = source ? source.indexHash : ''
        
        let isSourceConnected = !!source
        if (settings.musicSource === constants.SOURCES_S3)
            isSourceConnected = true

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
            session.isSourceConnected = isSourceConnected
            session.token = authTokenId
            session.isScrobbling = profile.scrobbleToken !== null
        }

        return session
    }
}