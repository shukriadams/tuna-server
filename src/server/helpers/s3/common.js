module.exports = {
    
    /**
     * Searches for files on s3, returns an array of string path for matches.
     * Search in this case is limited to an exact query - tuna.dat must be in the root of the given bucket.
     * source : profiles.sources.source object for s3
     * query : 'tuna.dat'
     */
    async search(source, query){
        //  s3 must have the index file in the bucket root
        return ['.tuna.dat']
    },


    /**
     * Downloads a file from s3 as a string. This should be used for accessing Tuna dat and json index files
     */
    async downloadAsString(accessToken, path){
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
     * Not used for s3 (not oauth flow)
     */
    async ensureTokensAreUpdated (profileId){
        
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
            Exception = require(_$+'types/exception'),
            settings = require(_$+'helpers/settings')

        try {
            if (settings.sandboxMode)
                request.get({ 
                        url : urljoin(settings.sandboxUrl, '/v1/sandbox/stream'), 
                    }).pipe(res)
            else {
                const creds = { accessKeyId : settings.s3key, secretAccessKey : settings.s3secret, endpoint : settings.s3host }
                if (!await s3utils.fileExists(creds, settings.s3bucket, mediaPath))
                    throw 'file not found'

                await s3utils.streamFile(creds, settings.s3bucket, mediaPath, res)
            }

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
     * Gets the contents of the index file. This is normally the .tuna.dat file in the dropbox folder root, but in
     * for dev purposes can also be:
     * - .tunaTest.dat on the dropbox root
     * - tuna.dat in the local /server/reference folder
     * - null, to simulate a user that has no index file.
     *
     * Returns null if no file found.
     */
    async getIndexFileContent(source, profileId){
        const s3utils = require('madscience-s3helper').utils,
            settings = require(_$+'helpers/settings')
            
        try{
            return await s3utils.getStringFile({ accessKeyId : settings.s3key, secretAccessKey : settings.s3secret, endpoint : settings.s3host }, settings.s3bucket, '.tuna.dat' )
        }catch(ex){
            console.log(ex)
            return null
        }
    },


    /**
     * Not used for s3 (not oauth flow)
     */
    async swapCodeForToken(profileId, token){
        
    }
}
