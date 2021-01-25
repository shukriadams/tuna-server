module.exports = {

    /**
     * Downloads a file from dropbox as a string. This should be used for accessing Tuna xml and json index files.
     * Note : dropbox paths MUST start with leading /, egs "/.tuna.dat"
     */
    async downloadAsString(sourceIntegration, profileId, path){
        if (!path.startsWith('/'))
            path = `/${path}`

        let constants = require(_$+'types/constants'),
            urljoin = require('urljoin'),
            settings = require(_$+'helpers/settings'),
            errorHelper = require(_$+'helpers/error'),
            httputils = require('madscience-httputils'),
            result = null,
            url = settings.sandboxMode ? urljoin(settings.siteUrl, `/v1/sandbox/dropbox/getFile/${path}}` ) : `https://content.dropboxapi.com/2/files/download`,
            connectInfo = { 
                headers : {
                    'Authorization' : `Bearer ${sourceIntegration.accessToken}`,
                    'Dropbox-API-Arg': `{"path": "${path}"}`
                }}

        try {
            result = await httputils.post(url, null, connectInfo)
        } catch (exception) {
            return errorHelper.throwUnexpectedError(
                profileId, 
                `Attempting to get "${path}" threw http error.`, 
                constants.ERROR_DEFAULT, 
                { exception, path })
        }

        if (!result.raw || !result.raw.statusCode) 
            return errorHelper.throwUnexpectedError(
                profileId, 
                `Attempting to get "${path}" returned a response that was badly formatted.`, 
                constants.ERROR_DEFAULT, 
                { path, result })


        if (result.raw.statusCode < 200 || result.raw.statusCode > 299){
            let body = null

            // try to parse body JSON, dropbox's API always returns JSON but wrap it just to be sure
            try {
                body = JSON.parse(result.body)
            } catch(ex){
                // dropbox API returned result that couldn't be parsed, this is unusual
                return errorHelper.throwUnexpectedError(
                    profileId, 
                    `Attempting to get "${path}" returned a response with invalid JSON.`, 
                    constants.ERROR_DEFAULT, 
                    { path, raw : result.body })
            }

            // no index found, user should generate index 
            if (body.error_summary && body.error_summary.includes('path/not_found')) 
                return errorHelper.throwUserError(
                    profileId, 
                    `"${path}" to found on Dropbox folder.`, 
                    constants.ERROR_NO_INDEX_FILE, 
                    { path, body })

            return errorHelper.throwUnexpectedError(
                profileId, 
                `"${path}" returned unhandled statuscode ${result.raw.statusCode}.`, 
                constants.ERROR_NO_INDEX_FILE, 
                { path, body })    
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
    async getFileLink(sources, profileId, path){
        const urljoin = require('urljoin'),
            httputils = require('madscience-httputils'),
            settings = require(_$+'helpers/settings'),
            errorHelper = require(_$+'helpers/error'),
            constants = require(_$+'types/constants')

        if (!sources[constants.SOURCES_DROPBOX])
            return errorHelper.throwUserError(
                profileId, 
                `Dropbox is not defined as a music source. Please set it up.`, 
                constants.ERROR_INVALID_SOURCE_INTEGRATION, 
                { sources })

        const accessToken = sources[constants.SOURCES_DROPBOX].accessToken
        if (!accessToken)
            return errorHelper.throwUserError(
                profileId, 
                `Dropbox is defined but integration is invalid. Try removing and reconnecting to Dropbox in profile setup. If this error persists, please file a bug report with Tuna devs.`, 
                constants.ERROR_INVALID_SOURCE_INTEGRATION, 
                { sources })

        // paths must not contain double slashes, this is a temporary workaround
        // and should be fixed at the indexer side
        path = path.replace('//', '/')

        let body = JSON.stringify({ path }),
            url = settings.sandboxMode ? urljoin(settings.siteUrl, `/v1/sandbox/dropbox/getTemporaryPath/somefile`) : `https://api.dropboxapi.com/2/files/get_temporary_link`,
            result = null
        
        try {
            result = await httputils.post(url, body, { 
                headers : {
                    'Authorization' : `Bearer ${accessToken}`
                }})
        } catch (exception){
            return errorHelper.throwUnexpectedError(
                profileId, 
                `Attempting to get fileLink for "${path}" returned a response that isn't beeing properly handled.`, 
                constants.ERROR_DEFAULT, 
                { exception, path })
        }


        if (result.raw.statusCode < 200 || result.raw.statusCode > 299)
            return errorHelper.throwUnexpectedError(
                profileId, 
                `"${path}" returned unhandled statuscode ${result.raw.statusCode}.`, 
                constants.ERROR_NO_INDEX_FILE, 
                { path, body })  

        try {
            const json = JSON.parse(result.body)
            return json.link
    
        } catch (exception){
            return errorHelper.throwUnexpectedError(
                profileId, 
                `Attempting to get fileLink for "${path}" returned a response with invalid JSON.`, 
                constants.ERROR_DEFAULT, 
                { exception, raw : result.body })
        }
    },


    /**
     * 
     */
    async post(options){
        return new Promise((resolve, reject)=>{
            try {
                const request = require('request')

                request(options, (err, response, body) => {
                    if (err)
                        return reject (err)

                    resolve({ body, response })
                })
    
            } catch(ex){
                reject(ex)
            }
        })
    },


    /**
     * Final stage of oauth connection - converts time-limited code for long-term token.
     */
    async swapCodeForToken(profileId, token){
        const urljoin = require('urljoin'),
            settings = require(_$+'helpers/settings'),
            constants = require(_$+'types/constants'),
            DropboxSource = require(_$+'types/dropboxSource'),
            JsonHelper = require(_$+'helpers/json'),
            profileLogic = require(_$+'logic/profiles'),
            errorHelper = require(_$+'helpers/error'),
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
        
        let r = null

        try {
            r = await this.post(options)
        } catch (exception){
            return errorHelper.throwUnexpectedError(
                profileId, 
                `Attempting to swap token threw http error.`, 
                constants.ERROR_DEFAULT, 
                { exception, token })
        }

        if (r.response.statusCode !== 200)
            return errorHelper.throwUnexpectedError(
                profileId, 
                `Token swap returned unexpected code ${r.response.statusCode}. You can try connecting to Dropbox again. If the problem persists, check logs.`, 
                constants.ERROR_INVALID_SOURCE_INTEGRATION, 
                { response : r.response })

        let json = null
        try {
            json = JsonHelper.parse(r.body)
        } catch (exception){
            return errorHelper.throwUnexpectedError(
                profileId, 
                `Failed to parse expected JSON response. You can try connecting to Dropbox again. If the problem persists, check logs.`, 
                constants.ERROR_DEFAULT, 
                { exception, raw : r.body })            
        }

        profile.sources[constants.SOURCES_DROPBOX] = Object.assign(profile.sources[constants.SOURCES_DROPBOX] || {}, DropboxSource.new())
        profile.sources[constants.SOURCES_DROPBOX].accessToken = json.access_token
        
        await profileLogic.update(profile)
    }
}
