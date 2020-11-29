module.exports = {

    /**
     * Downloads a file from dropbox as a string. This should be used for accessing Tuna xml and json index files.
     * Note : dropbox paths MUST start with leading /, egs "/.tuna.dat"
     */
    async downloadAsString(sourceIntegration, path){
        let Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            httputils = require('madscience-httputils'),
            urljoin = require('urljoin'),
            settings = require(_$+'helpers/settings'),
            result

        try {
            if (!path.startsWith('/'))
                path = `/${path}`
                
            const url = settings.sandboxMode ? urljoin(settings.siteUrl, `/v1/sandbox/dropbox/getFile/${path}}` ) : `https://content.dropboxapi.com/2/files/download`
            
            result = await httputils.post(url, null, { 
                headers : {
                    'Authorization' : `Bearer ${sourceIntegration.accessToken}`,
                    'Dropbox-API-Arg': `{"path": "${path}"}`
                }})

        } catch (ex){
            throw new Exception({ forceLog : true, inner : ex })
        }

        if (response.statusCode !== 200)
            throw new Exception({ inner : `Failed to download file ${path} : ${response.body}` })
        
        if (result.raw.statusCode < 200 || result.raw.statusCode > 299){
            let body

            // try to parse body JSON, dropbox's API always returns JSON but wrap it just to be sure
            try {
                body = JSON.parse(result.body)
            } catch(ex){
                throw new Exception({ forceLog : true, log : result })
            }

            if (body.error_summary && body.error_summary.includes('path/not_found'))
                throw new Exception({ code : constants.ERROR_NO_INDEX_FILE, public : `${path} not found on Dropbox, rerun indexer` })

            throw new Exception({ forceLog : true, log : result.body })
        }

        return result.body
    },


    getLabel(){
        return 'Dropbox'
    }, 


    getOauthUrl (authTokenId){
        const urljoin = require('urljoin'),
            settings = require(_$+'helpers/settings')

        if (settings.sandboxMode)
            return urljoin(settings.siteUrl, `/v1/sandbox/dropboxAuthenticate?&state=${authTokenId}_TARGETPAGE`)
        else
            return `https://www.dropbox.com/oauth2/authorize?&response_type=code&client_id=${settings.dropboxAppId}&redirect_uri=${settings.siteUrl}/api/catch/dropbox&state=${authTokenId}_TARGETPAGE`
    },


    /**
     * not needed on dropbox
     */
    async ensureIntegration (profileId){
        
    },


    /**
     * Gets a temporary link to a file on dropbox. This link is used to stream the file to the browser.
     */
    async getFileLink(sources, path){
        const 
            urljoin = require('urljoin'),
            httputils = require('madscience-httputils'),
            settings = require(_$+'helpers/settings'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants')

        return new Promise(async (resolve, reject) => {

            if (!sources[constants.SOURCES_DROPBOX])
                return reject(new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION, log : 'no source defined' }))

            const accessToken = sources[constants.SOURCES_DROPBOX].accessToken

            if (!accessToken)
                return reject(new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION, log : 'no access token' }))

            try {

                // paths must not contain double slashes, this is a temporary workaround
                // and should be fixed at the indexer side
                path = path.replace('//', '/')

                const 
                    body = JSON.stringify({ path }),
                    url = settings.sandboxMode ? urljoin(settings.siteUrl, `/v1/sandbox/dropbox/getTemporaryPath/somefile`) : `https://api.dropboxapi.com/2/files/get_temporary_link`,
                    result = await httputils.post(url, body, { 
                        headers : {
                            'Authorization' : `Bearer ${accessToken}`
                        }})

                if (result.raw.statusCode < 200 || result.raw.statusCode > 299)
                    return reject(result.body)

                const json = JSON.parse(result.body)
                resolve(json.link)
            } catch (ex) {
                reject(ex)
            }

        })
    },


    /**
     * Final stage of oauth connection - converts time-limited code for long-term token.
     */
    async swapCodeForToken(profileId, token){
        const request = require('request'),
            urljoin = require('urljoin'),
            settings = require(_$+'helpers/settings'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            DropboxSource = require(_$+'types/dropboxSource'),
            JsonHelper = require(_$+'helpers/json')

        return new Promise(async (resolve, reject) => {

            try {
                // must do require here, if at start of file get close-file import tangle
                const profileLogic = require(_$+'logic/profiles'),
                    profile = await profileLogic.getById(profileId),
                    options = {
                        url : settings.sandboxMode ? urljoin(settings.siteUrl, '/v1/sandbox/dropboxTokenSwap') : 'https://api.dropboxapi.com/oauth2/token',
                        method : 'POST',
                        form : {
                            code : token,
                            grant_type : 'authorization_code',
                            client_id : settings.dropboxAppId,
                            client_secret : settings.dropboxAppSecret,
                            redirect_uri : urljoin(settings.siteUrl, '/v1/oauth/dropbox') 
                        }
                    }

                request(options, async (err, response, body) => {
                        if (err)
                            return reject(err)

                        if (response.statusCode === 200) {

                            let json = JsonHelper.parse(body),
                                // if dev token set, always use that
                                accessToken = json.access_token

                            profile.sources[constants.SOURCES_DROPBOX] = Object.assign(profile.sources[constants.SOURCES_DROPBOX] || {}, DropboxSource.new())
                            profile.sources[constants.SOURCES_DROPBOX].accessToken = accessToken
                            
                            try {
                                await profileLogic.update(profile)
                                resolve()
                            } catch(ex){
                                reject(ex)
                            }
                            
                        } else {
                            reject(new Exception({ log : `Invalid response on 2nd stage dropbox call : ${response.statusCode}, body ${body}` }))
                        }
                    })

            } catch (ex) {
                reject (ex)
            }

        })
    }
}
