module.exports = {
    
    /**
     * Searches for files on s3, returns an array of string path for matches.
     * Search in this case is limited to an exact query - tuna.dat must be in the root of the given bucket.
     * source : profiles.sources.source object for s3
     * query : 'tuna.dat'
     */
    async search(source, query){
        
    },


    /**
     * Downloads a file from s3 as a string. This should be used for accessing Tuna dat and json index files
     */
    async downloadAsString(accessToken, path){
        
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
    async getFileLink(sources, path){
        
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
        
    },


    /**
     * Not used for s3 (not oauth flow)
     */
    async swapCodeForToken(profileId, token){
        
    }
}
