const
    urljoin = require('urljoin'),
    request = require('request'),
    httputils = require('madscience-httputils'),
    constants = require(_$+'types/constants'),
    Exception = require(_$+'types/exception'),
    settings = require(_$+'helpers/settings'),
    profileLogic = require(_$+'logic/profiles'),
    xmlHelper = require(_$+'helpers/xml'),
    jsonHelper = require(_$+'helpers/json'),
    NextCloudSource = require(_$+'types/nextcloudSource'),
    timebelt = require('timebelt'),
    log = require(_$+'logic/log')

module.exports = { 
    
    // export these for test shimming
    httputils,
    log,
    profileLogic,

    getLabel(){
        return 'NextCloud'
    },

    getOauthUrl (authTokenId){
        return `${settings.nextCloudHost}${settings.nextCloudAuthorizeUrl}?state=${authTokenId}_TARGETPAGE&redirect_uri=${settings.siteUrl}${settings.nextCloudCodeCatchUrl}`
    },

    async downloadAsString(accessToken, path){
        const response = await httputils.downloadString ({ 
            url : urljoin(settings.nextCloudHost, path), 
            headers : {
                'Authorization' : `Bearer ${accessToken}`
            }});

        return response.body
    },

    /**
     * Ensures access tokens for a given user have been updated. should be called as often as possible
     */
    async ensureTokensAreUpdated (profileId){
        let profile = await profileLogic.getById(profileId), 
            source = profile.sources[constants.SOURCES_NEXTCLOUD],
            hasExpired = new Date().getTime() > timebelt.addSeconds(source.tokenDate, source.expiresIn).getTime()

        // If we suspect token has not expired and we're not going to force an update anyway, do a pre-emptive simple properties lookup on a fake file to test token 
        if (!hasExpired){
            try {
                const body = '<?xml version="1.0" encoding="UTF-8"?><d:propfind xmlns:d="DAV:"><d:prop xmlns:oc="http://owncloud.org/ns"><oc:permissions/></d:prop></d:propfind>'
                const lookup = await httputils.post(urljoin(settings.nextCloudHost, `/remote.php/dav/files/${source.userId}/whatever`), body, { 
                    method : 'PROPFIND',
                    headers : {
                        'Authorization' : `Bearer ${source.accessToken}`
                    }})

                if (lookup.raw.statusCode === 401)
                    hasExpired  = true

            } catch(ex){
                throw new Exception({
                    log: `Unexpected error doing token check`,
                    inner : ex
                })
            }
        }

        // if still notexpired, we're confident keys work
        if (!hasExpired)
            return

        let body = `grant_type=refresh_token&refresh_token=${source.refreshToken}&client_id=${settings.nextCloudClientId}&client_secret=${settings.nextCloudSecret}`,
            response = await httputils.postUrlString(urljoin(settings.nextCloudHost, settings.nextCloudTokenExchangeUrl),body),
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

    /**
     * Searchs for files, returns string array of paths found, empty array if none
     */
    async search(source, query) {
        const
            accessToken = source.accessToken,
            nextCloudUserId = source.userId,
            options = {
                method: 'SEARCH',
                headers: {
                    'Content-Type': 'application/xml',
                    'Authorization' : `Bearer ${accessToken}`
                }
            },
            body = 
                `<?xml version="1.0" encoding="UTF-8"?>
                <d:searchrequest xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
                    <d:basicsearch>
                        <d:select>
                            <d:prop>
                                <oc:fileid/>
                            </d:prop>
                        </d:select>
                        <d:from>
                            <d:scope>
                                <d:href>/files/${nextCloudUserId}</d:href>
                                <d:depth>infinity</d:depth>
                            </d:scope>
                        </d:from>
                        <d:where>
                            <d:like>
                                <d:prop>
                                    <d:displayname/>
                                </d:prop>
                                <d:literal>${query}</d:literal>
                            </d:like>
                        </d:where>
                        <d:orderby/>
                    </d:basicsearch>
                </d:searchrequest>`

        const result = await this.httputils.post(`${settings.nextCloudHost}/remote.php/dav`, body, options)
        // todo : handle server call timing out

        // auth failure : This should not happen - we should have explicitly checked tokens just before this. Log explicit because
        // we will want to know if this is happening
        if (result.raw.statusCode < 200 || result.raw.statusCode > 299)
            throw new Exception({ 
                code : constants.ERROR_INVALID_SOURCE_INTEGRATION,
                forceLog : true,
                log: '401 despite explicit token testing',
                inner : {
                    body : result.body
                }
            })

        const resultXml = await xmlHelper.toDoc(result.body)
            
        // no files found
        if (!resultXml['d:multistatus']['d:response'])
            return []

        // write new index files, preserve existing ones so we keep their history properties
        let results = []

        for (let i = 0 ; i < resultXml['d:multistatus']['d:response'].count(); i ++){
            const item = resultXml['d:multistatus']['d:response'].at(i)
            results.push(item['d:href'].text())
        }

        return results
    },

    async swapCodeForToken(profileId, code){
        let tokenSwap = await httputils.postUrlString(
            `${settings.nextCloudHost}${settings.nextCloudTokenExchangeUrl}`,  
            `grant_type=authorization_code&code=${code}&client_id=${settings.nextCloudClientId}&client_secret=${settings.nextCloudSecret}`
        )

        let profile = await profileLogic.getById(profileId),
            swapResult = jsonHelper.parse(tokenSwap.body)

        if (swapResult.error)
            throw new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION })

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
     * @mediaPath : the relative path of the asset to fetch.
     * @nextCloudUserName : username on the nextcloud server to fetch from
     * @bearerToken : access token to gain access to @nextCloudUserName's file
     * @res : NodeJS response object to stream media back on
     */
     async streamMedia (profileId, mediaPath, res){
        // always ensure tokens are up-to-date before doing an API call
        await this.ensureTokensAreUpdated(profileId)

        let profile = await profileLogic.getById(profileId),
            source = profile.sources[constants.SOURCES_NEXTCLOUD]

        if (source.status !== constants.SOURCE_CONNECTION_STATUS_WORKING)
            throw new Exception({ 
                code : constants.ERROR_INVALID_SOURCE_INTEGRATION,
                params: constants.SOURCES_NEXTCLOUD
            })

        try {
            request.get({ 
                url : urljoin(settings.nextCloudHost, `/remote.php/dav/files/${source.userId}`, mediaPath), 
                headers : {
                    'Authorization' : `Bearer ${source.accessToken}`
                }}).pipe(res)
    
        } catch (ex){
            throw new Exception({
                log : 'Unexpected error fetching media to stream',
                inner : {
                    ex,
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
        return urljoin(settings.siteUrl, `/v1/songs/stream/${authToken}/${new Buffer(path).toString('base64')}`)
    }

}