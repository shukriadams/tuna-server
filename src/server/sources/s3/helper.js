module.exports = {

    /**
     * Downloads a file from s3 as a string. This should be used for accessing Tuna dat and json index files
     */
    async downloadAsString(sourceIntegration, profileId, path){
        const s3utils = require('madscience-s3helper').utils,
            settings = require(_$+'helpers/settings')
            
        try{
            return await s3utils.getStringFile({ accessKeyId : settings.s3key, secretAccessKey : settings.s3secret, endpoint : settings.s3host }, settings.s3bucket, path )
        }catch(ex){
            console.log(ex)
            return null
        }
    },


    getLabel(){
        return 'S3'
    }, 

    /**
     * Not used for s3 (not oauth flow)
     */
    getOauthUrl (authTokenId){
        return ''        
    },


    /**
     * Gets a link to streamable source. In the case of s3, we stream from our own API, which in turn retrieves the file from s3.
     */
    async getFileLink(sources, path, authToken){
        const
            urljoin = require('urljoin'),
            settings = require(_$+'helpers/settings')

        return urljoin(settings.siteUrl, `/v1/stream/${authToken}/${Buffer.from(path).toString('base64')}`)
    },

    async streamMedia (profileId, mediaPath, res){
        
        // s3 paths don't work the same as dropbox / nextcloud, they cannot have a leading slash
        if (mediaPath.startsWith('/'))
            mediaPath = mediaPath.substring(1, mediaPath.length)

        const s3utils = require('madscience-s3helper').utils,
            urljoin = require('urljoin'),
            request = require('request'),
            errorHelper = require(_$+'helpers/error'),
            settings = require(_$+'helpers/settings')

        try {
            if (settings.sandboxMode)
                request.get({ 
                        url : urljoin(settings.siteUrl, '/v1/sandbox/stream'), 
                    }).pipe(res)
            else {
                const creds = { accessKeyId : settings.s3key, secretAccessKey : settings.s3secret, endpoint : settings.s3host }
                if (!await s3utils.fileExists(creds, settings.s3bucket, mediaPath))
                    throw 'file not found'

                await s3utils.streamFile(creds, settings.s3bucket, mediaPath, res)
            }

        } catch (exception){
            return errorHelper.throwUnexpectedError(
                profileId, 
                `Unexpected error fetching media stream`, 
                constants.ERROR_DEFAULT, 
                { exception, profileId, mediaPath })
        }
    },

    
    /**
     * Not used for s3 (not oauth flow)
     */
    async swapCodeForToken(profileId, token){
        
    }
}
