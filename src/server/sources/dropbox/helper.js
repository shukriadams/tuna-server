module.exports = {

    /**
     * Downloads a file from dropbox as a string. This should be used for accessing Tuna xml and json index files.
     * Note : dropbox paths MUST start with leading /, egs "/.tuna.dat"
     */
    async downloadAsString(accessToken, path){
        const Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            httputils = require('madscience-httputils'),
            settings = require(_$+'helpers/settings')

        if (!path.startsWith('/'))
            path = `/${path}`
            
        return new Promise(async(resolve, reject)=>{
            try {

                const url = settings.sandboxMode ? urljoin(settings.siteUrl, `/v1/sandbox/dropbox/getFile/${path}}` ) : `https://content.dropboxapi.com/2/files/download`,
                    result = await httputils.post(url, null, { 
                        headers : {
                            'Authorization' : `Bearer ${accessToken}`,
                            'Dropbox-API-Arg': `{"path": "${path}"}`
                        }})

                if (result.raw.statusCode < 200 || result.raw.statusCode > 299){
                    let body = JSON.parse(result.body)
                    if (body.error_summary && body.error_summary.includes('path/not_found'))
                        return reject(new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION, public : `${path} not found on Dropbox, rerun indexer` }))
                    
                    return reject(result.body)
                }

                resolve(result.body)

            } catch(ex){
                reject(ex)
            }
        })
    },


    getLabel(){
        return 'Dropbox'
    }, 


    getOauthUrl (authTokenId){
        const 
            urljoin = require('urljoin'),
            settings = require(_$+'helpers/settings')

        if (settings.sandboxMode)
            return urljoin(settings.siteUrl, `/v1/sandbox/dropboxAuthenticate?&state=${authTokenId}_TARGETPAGE`)
        else
            return `https://www.dropbox.com/oauth2/authorize?&response_type=code&client_id=${settings.dropboxAppId}&redirect_uri=${settings.siteUrl}/api/catch/dropbox&state=${authTokenId}_TARGETPAGE`
    },


    /**
     * not neededon dropbox
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
                return reject(new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION}))

            const accessToken = sources[constants.SOURCES_DROPBOX].accessToken

            if (!accessToken)
                return reject(new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION}))

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
     * Gets the contents of the index file. This is normally the .tuna.dat file in the dropbox folder root, but in
     * for dev purposes can also be:
     * - .tunaTest.dat on the dropbox root
     * - tuna.dat in the local /server/reference folder
     * - null, to simulate a user that has no index file.
     *
     * Returns null if no file found.
     */
    async getIndexFileContent(source, profileId){
        
        let accessToken = source.accessToken,
            Exception = require(_$+'types/exception')

        // this is currently a known issue, and dropbox deals with the error badly, so try to catch it first
        if (!accessToken)
            throw new Exception({
                log : 'getIndexFileContent received an empty dropbox access token, user data is likely corrupted'
            })

        return await this.downloadAsString(accessToken, '.tuna.dat')
    },


    /**
     * Final stage of oauth connection - converts time-limited code for long-term token.
     */
    async swapCodeForToken(profileId, token){
        const 
            request = require('request'),
            urljoin = require('urljoin'),
            settings = require(_$+'helpers/settings'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            DropboxSource = require(_$+'types/dropboxSource'),
            JsonHelper = require(_$+'helpers/json')

        return new Promise(async (resolve, reject) => {

            try {
                // must do require here, if at start of file get close-file import tangle
                let profileLogic = require(_$+'logic/profiles'),
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
                            reject(new Exception({ log : `Invalid response on 2nd stage dropbox call : ${response.statusCode}` }))
                        }
                    })

            } catch (ex) {
                reject (ex)
            }

        })
    }
}
