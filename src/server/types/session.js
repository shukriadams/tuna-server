module.exports = {
    new : function(){

        // note, this far more complex than default session defined in redux
        return {
            name: null, // profile name, most likely not used anymore
            email: null, // user email. also login name
            profileId : null,
            isSourceConnected : false,
            sourceOauthUrl : null, // url for source oauth flow (dropbox, nextcloud, etc)
            lastfmOauthUrl : null, // url for lastfm oauth flow
            token : null, // session token, like a cookie id
            playlists : [], // not used
            isScrobbling : false // true if scrobbling is enabled
        };
    }
};