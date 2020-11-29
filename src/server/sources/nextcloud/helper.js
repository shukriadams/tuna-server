module.exports = { 

    async downloadAsString(sourceIntegration, path){
        const urljoin = require('urljoin'),
            httputils = require('madscience-httputils'),
            Exception = require(_$+'types/exception'),
            settings = require(_$+'helpers/settings'),
            url = settings.sandboxMode ? urljoin(settings.siteUrl, `/v1/sandbox/nextcloud/getfile/.tuna.json`) : urljoin(settings.nextCloudHost, `remote.php/dav/files/${sourceIntegration.userId}/${path}`),
            response = await httputils.downloadString ({ 
                url, 
                headers : {
                    'Authorization' : `Bearer ${sourceIntegration.accessToken}`
                }})

        if (response.statusCode !== 200)
            throw new Exception({ inner : `Failed to download file ${path} : ${response.body}` })

        return response.body
    },
    

    getLabel(){
        return 'NextCloud'
    },


    getOauthUrl (authTokenId){
        const urljoin = require('urljoin'),
            settings = require(_$+'helpers/settings')

        if (settings.sandboxMode)
            return urljoin(settings.siteUrl, `/v1/sandbox/nextcloudAuthenticate?state=${authTokenId}_TARGETPAGE`)
        else
            return `${settings.nextCloudHost}${settings.nextCloudAuthorizeUrl}?response_type=code&client_id=${settings.nextCloudClientId}&state=${authTokenId}_TARGETPAGE&redirect_uri=${settings.siteUrl}${settings.nextCloudCodeCatchUrl}`
    },


    /**
     * Ensures access tokens for a given user have been updated. should be called as often as possible
     */
    async ensureIntegration (profileId){
        let urljoin = require('urljoin'),
            httputils = require('madscience-httputils'),
            constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            settings = require(_$+'helpers/settings'),
            profileLogic = require(_$+'logic/profiles'),
            jsonHelper = require(_$+'helpers/json'),
            timebelt = require('timebelt'),
            profile = await profileLogic.getById(profileId), 
            source = profile.sources[constants.SOURCES_NEXTCLOUD],
            hasExpired = new Date().getTime() > timebelt.addSeconds(source.tokenDate, source.expiresIn).getTime()

        // if token time has not yet run out, do a pre-emptive simple properties lookup on a fake file to test token 
        if (!hasExpired){
            try {
                const body = '<?xml version="1.0" encoding="UTF-8"?><d:propfind xmlns:d="DAV:"><d:prop xmlns:oc="http://owncloud.org/ns"><oc:permissions/></d:prop></d:propfind>',
                    url = settings.sandboxMode ? urljoin(settings.siteUrl, `/v1/sandbox/nextcloud/find/.tuna.dat`) : urljoin(settings.nextCloudHost, `/remote.php/dav/files/${source.userId}/whatever`),
                    method = settings.sandboxMode ? 'POST' : 'PROPFIND',
                    lookup = await httputils.post(url, body, { 
                        method,
                        headers : {
                            'Authorization' : `Bearer ${source.accessToken}`
                        }})
                        
                // use
                if (lookup.raw.statusCode === 401)
                    hasExpired  = true

            } catch(ex) {
                throw new Exception({
                    log: `Unexpected error doing token check`,
                    inner : ex
                })
            }
        }

        // if still notexpired, we're confident keys work
        if (!hasExpired)
            return

        // refresh token
        let body = `grant_type=refresh_token&refresh_token=${source.refreshToken}&client_id=${settings.nextCloudClientId}&client_secret=${settings.nextCloudSecret}`,
            url = settings.sandboxMode ? urljoin(settings.siteUrl, '/v1/sandbox/nextcloud/refresh') : urljoin(settings.nextCloudHost, settings.nextCloudTokenExchangeUrl),
            response = await httputils.postUrlString(url, body),
            content = null
        
        if (typeof response.body === 'string')
            content = jsonHelper.parse(response.body)

        // if known content error occurs, integration is broken and has to be re-authorized by user. flag it as such and exit
        if (response.raw.statusCode === 400 || content.error === 'invalid_request'){
            source.status = constants.SOURCE_CONNECTION_STATUS_USER_REAUTHORIZE
            await profileLogic.update(profile)
            return
        }

        // Well that was unexpected
        if (content.error)
            throw new Exception({
                log: `Unexpected content`,
                inner: content.error
            })

        source.accessToken = content.access_token
        source.refreshToken = content.refresh_token
        source.expiresIn = parseInt(content.expires_in) - 120 // give extra 2 minutes margin for safety
        source.tokenDate = new Date().getTime()

        await profileLogic.update(profile)
    },


    async swapCodeForToken(profileId, code){
        let urljoin = require('urljoin'),
            httputils = require('madscience-httputils'),
            constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            settings = require(_$+'helpers/settings'),
            profileLogic = require(_$+'logic/profiles'),
            jsonHelper = require(_$+'helpers/json'),
            NextCloudSource = require(_$+'types/nextcloudSource'),
            url = `${settings.nextCloudHost}${settings.nextCloudTokenExchangeUrl}`

        if (settings.sandboxMode){
            url = urljoin(settings.siteUrl, 'v1/sandbox/nextcloudTokenSwap')
            console.log(`SANDBOX enabled - token will be swapped locally`)
        }

        const tokenSwap = await httputils.postUrlString(url, `grant_type=authorization_code&code=${code}&client_id=${settings.nextCloudClientId}&client_secret=${settings.nextCloudSecret}`),
            profile = await profileLogic.getById(profileId),
            swapResult = jsonHelper.parse(tokenSwap.body)

        if (swapResult.error)
            throw new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION, inner : swapResult.error })

        profile.sources[constants.SOURCES_NEXTCLOUD] = Object.assign(profile.sources[constants.SOURCES_NEXTCLOUD] || {}, NextCloudSource.new())
        profile.sources[constants.SOURCES_NEXTCLOUD].accessToken = swapResult.access_token
        profile.sources[constants.SOURCES_NEXTCLOUD].expiresIn = swapResult.expires_in
        profile.sources[constants.SOURCES_NEXTCLOUD].refreshToken = swapResult.refresh_token
        profile.sources[constants.SOURCES_NEXTCLOUD].userId = swapResult.user_id
        profile.sources[constants.SOURCES_NEXTCLOUD].tokenDate = new Date().getTime()

        await profileLogic.update(profile)
    },


    /**
     * streams the media item @path on nextcloud server
     * @profileId : string, profile id media will be streamed for. Must have valid nextcloud integration
     * @mediaPath : the relative path of the asset to fetch.
     * @res : NodeJS response object to stream media back on
     */
     async streamMedia (profileId, mediaPath, res){

        const urljoin = require('urljoin'),
            request = require('request'),
            constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            settings = require(_$+'helpers/settings'),
            profileLogic = require(_$+'logic/profiles'),
            profile = await profileLogic.getById(profileId),
            source = profile.sources[constants.SOURCES_NEXTCLOUD]

        if (source.status !== constants.SOURCE_CONNECTION_STATUS_WORKING)
            throw new Exception({ 
                code : constants.ERROR_INVALID_SOURCE_INTEGRATION,
                params: constants.SOURCES_NEXTCLOUD
            })

        // ensure tokens are up-to-date before doing an API call
        await this.ensureIntegration(profileId)
        const url = settings.sandboxMode ? urljoin(settings.siteUrl, '/v1/sandbox/stream') : urljoin(settings.nextCloudHost, `/remote.php/dav/files/${source.userId}`, mediaPath)

        // stream media from nextcloud back
        try {
            request.get({ 
                url, 
                headers : {
                    'Authorization' : `Bearer ${source.accessToken}`
                }}).pipe(res)
    
        } catch (ex){
            throw new Exception({
                log : 'Unexpected error fetching media stream',
                inner : {
                    ex,
                    profileId,
                    mediaPath
                }
            })
        }
    },


    /**
     * For dropbox, we can use the filelink to stream media directly from dropbox. Nextcloud doesn't allow this, so instead
     * we create our endpath that acts as a streaming proxy for nextcloud media.
     * The media path is returned as base64 string because it's a URL itself
     */
    async getFileLink(sources, path, authToken){
        const urljoin = require('urljoin'),
            settings = require(_$+'helpers/settings')

        return urljoin(settings.siteUrl, `/v1/stream/${authToken}/${Buffer.from(path).toString('base64')}`)
    }

}
