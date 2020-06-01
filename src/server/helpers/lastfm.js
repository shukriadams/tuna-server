const 
    crypto = require('crypto'),
    request = require('request'),
    xmlreader = require('xmlreader'),
    urljoin = require('urljoin'),
    settings = require(_$+'helpers/settings'),
    log = require(_$+'logic/log'),
    xmlHelper = require(_$+'helpers/xml'),
    constants = require(_$+'types/constants'),
    Exception = require(_$+'types/exception'),
    cache = require(_$+'helpers/cache'),
    requestNative = require('request-promise-native'),
    PlaySession = require(_$+'types/playSession')

module.exports = {

    methodSignature(parameters){
        // sort parameters alphabetically
        let sortedParameters = [],
            apiSignature = '';

        for (let property in parameters)
            sortedParameters.push(property);

        sortedParameters.sort((a, b)=>{
            if(a < b) return -1;
            if(a > b) return 1;
            return 0;
        });

        for (let i = 0 ; i < sortedParameters.length; i ++)
            apiSignature += sortedParameters[i] + parameters[sortedParameters[i]];

        apiSignature += settings.lastFmApiSecret;
        apiSignature = crypto.createHash('md5').update(apiSignature, 'utf8').digest('hex');

        return apiSignature;
    },

    getOauthUrl(authTokenId){
        if (settings.lastFmDevAuthKey)
            return `${settings.siteUrl}/api/sandbox/lastfmAuthenticate?&session=${authTokenId}`;
        
        return `http://www.last.fm/api/auth/?&api_key=${settings.lastFmApiKey}&cb=${settings.siteUrl}/api/catch/lastfm?session=${authTokenId}&state=none`;
    },

    /* sends message to last fm about current playing song.  */
    async nowPlaying(profile, song){
        return new Promise(async (resolve, reject) => {

            try {

                if (!profile.scrobbleToken)
                    resolve();

                let cacheKey = profile.id + '_nowPlaying',
                    playSession = PlaySession.new();

                playSession.songId = song.id;
                playSession.started = new Date().getTime();

                await cache.add(cacheKey, playSession);

                let parameters = {
                        method : 'track.updateNowPlaying',
                        artist : song.artist.trim(),
                        album : song.album.trim(),
                        track : song.name.trim(),
                        sk : profile.scrobbleToken,
                        api_key : settings.lastFmApiKey
                    },
                    signature = this.methodSignature(parameters);

                let options = {
                    url : 'http://ws.audioscrobbler.com/2.0/',
                    method : 'POST',
                    form : {
                        method : 'track.updateNowPlaying',
                        artist : song.artist.trim(),
                        album : song.album.trim(),
                        track : song.name.trim(),
                        sk : profile.scrobbleToken,
                        api_key : settings.lastFmApiKey,
                        api_sig : signature
                    }
                };

                request(options, (err, response, body) => {
                    if (err)
                        return reject(err)

                    xmlreader.read(body, (err, xml) => {
                        if (err)
                            return reject(err)

                        let status = xml.lfm.attributes().status;
                        if (status === 'ok')
                            return resolve()

                        // don't throw errors from last.fm, it fails so often these should be treated as routine
                        if (settings.logLastFmResponses)
                            log.create(body, 'lastfm updateNowPlaying failure')

                        // todo : this should be written to a log instead of passed up to user, it's too complex to build
                        // meaningful UI workflows around complex dynamic feedback
                        resolve({ code: 2, message : 'Last.fm returned an error while updating nowplaying' })
                    })
                })

            } catch (ex) {
                reject (ex)
            }
        })
    },

    async scrobble(profile, song, startedPlayingUnixTime){
        return new Promise((resolve, reject) => {
            let parameters = {
                    method : 'track.scrobble',
                    artist : song.artist.trim(),
                    album : song.album.trim(),
                    track : song.name.trim(),
                    timestamp : startedPlayingUnixTime,
                    sk : profile.scrobbleToken,
                    api_key : settings.lastFmApiKey
                },
                signature = this.methodSignature(parameters)

            let options = {
                url : 'http://ws.audioscrobbler.com/2.0/',
                method : 'POST',
                form : {
                    method : 'track.scrobble',
                    artist : song.artist.trim(),
                    album : song.album.trim(),
                    track : song.name.trim(),
                    timestamp : startedPlayingUnixTime,
                    sk : profile.scrobbleToken,
                    api_key : settings.lastFmApiKey,
                    api_sig : signature
                }
            }

            request(options, (err, response, body) => {
                if (err)
                    return reject(err)

                xmlreader.read(body, (err, xml) => {
                    if (err)
                        return reject(err)

                    const status = xml.lfm.attributes().status
                    if (status === 'ok')
                        return resolve({ code: 0, message : 'lastfm scrobble successful' })

                    if (settings.logLastFmResponses)
                        log.create(body, 'lastfm scrobble failure')

                    resolve({ code: 2, message : 'Last.fm returned an error while scrobbling' })
                })
            })
        })
    },

    async swapCodeForToken(profileId, sessionToken){
        return new Promise(async (resolve, reject) => {

            try {

                if (!sessionToken)
                    throw new Exception({ 
                        code: constants.ERROR_INVALID_SOURCE_INTEGRATION, 
                        params : constants.LASTFM,
                        forceLog : true,
                        log : 'Empty last.fm token, swap not possible' 
                    })

                let apiSignature = `api_key${settings.lastFmApiKey}methodauth.getSessiontoken${sessionToken}settings.lastFmApiSecret`

                apiSignature = crypto.createHash('md5').update(apiSignature, 'utf8').digest('hex')

                let options = {
                    url : settings.lastFmDevAuthKey ? urljoin(settings.siteUrl, '/v1/sandbox/lastfmTokenSwap') : `http://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${settings.lastFmApiKey}&token=${sessionToken}&api_sig=${apiSignature}`,
                    method : 'GET'
                }

                let key = null;
                try {
                    let body = await requestNative(options),
                        xml = await xmlHelper.toDoc(body)
                    key = xml.lfm.session.key.text()
                } catch(ex) {
                    return reject(ex)
                }

                let profileLogic = require(_$+'logic/profiles'),
                    profile = await profileLogic.getById(profileId)

                if (!profile)
                    throw new Exception({
                        code : constants.ERROR_INVALID_USER_OR_SESSION, 
                        forceLog : true,
                        log: 'Invalid profile, this shouldn\'t happen'
                    })

                // bypass, set key directly
                profile.scrobbleToken = settings.lastFmDevAuthKey || key

                await profileLogic.update(profile)
                resolve()

            } catch(ex){
                reject (ex)
            }

        })
    }

}