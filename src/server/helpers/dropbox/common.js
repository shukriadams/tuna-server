const 
    Dropbox = require('dropbox'),
    request = require('request'),
    fs = require('fs'),
    urljoin = require('urljoin'),
    settings = require(_$+'helpers/settings'),
    logger = require('winston-wrapper').instance(settings.logPath),
    Exception = require(_$+'types/exception'),
    constants = require(_$+'types/constants'),
    DropboxSource = require(_$+'types/dropboxSource'),
    JsonHelper = require(_$+'helpers/json')

module.exports = {
    
    /**
     * Searches for files on dropbox, returns an array of string path for matches
     * 
     */
    async search(source, query){
        
        return new Promise((resolve, reject)=> {

            try {
                const dropbox = new Dropbox({ accessToken : source.accessToken })

                dropbox.filesSearch({ path : '', query })
                    .then(async (result) => {
                        const paths = []
                        
                        if (result && result.matches && result.matches.length)
                            for (let item of result.matches)
                                paths.push(item.metadata.path_display)

                        resolve(paths)
                    })
                    .catch(err => {
                        reject(err)
                    })

            } catch (ex) {
                reject(ex)
            }
        })
    },


    /**
     * Downloads a file from dropbox as a string. This should be used for accessing Tuna xml and json index files
     */
    async downloadJsonStatus(accessToken, path){
        return new Promise(async(resolve, reject)=>{
            try {
                if (settings.musicSourceSandboxMode){
                    const json = await fs.promises.readFile(_$+'/reference/.tuna.json')
                    resolve(json)
                } else {
                    const dropbox = new Dropbox({ accessToken })
                    dropbox.filesDownload({ path })
                        .then(data => {
                            resolve(new Buffer(data.fileBinary, 'binary').toString('utf8'))
                        }).catch(err => {
                            reject(err)
                        })
                }
        
            } catch(ex){
                reject(ex)
            }
        })
    },


    getLabel(){
        return 'Dropbox'
    }, 


    getOauthUrl (authTokenId){
        if (settings.dropboxDevOauthToken)
            return urljoin(settings.siteUrl, `/v1/dev/dropboxAuthenticate?&state=${authTokenId}_TARGETPAGE`)
        else
            return `https://www.dropbox.com/oauth2/authorize?&response_type=code&client_id=${settings.dropboxAppId}&redirect_uri=${settings.siteUrl}/api/catch/dropbox&state=${authTokenId}_TARGETPAGE`
    },


    /**
     * Deliberately empty
     */
    async ensureTokensAreUpdated (profileId){
        
    },


    /**
     * Gets a temporary link to a file on dropbox. This link is used to stream the file to the browser.
     */
    async getFileLink(sources, path){
        return new Promise((resolve, reject) => {

            if (!sources[constants.SOURCES_DROPBOX])
                return reject(new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION}))

            const accessToken = sources[constants.SOURCES_DROPBOX].accessToken

            if (!accessToken)
                return reject(new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION}))

            try {

                const dropbox = new Dropbox({ accessToken })

                // paths must not contain double slashes, this is a temporary workaround
                // and should be fixed at the indexer side
                path = path.replace('//', '/')

                dropbox.filesGetTemporaryLink({ path })
                    .then( data => {
                        resolve(data.link)
                    }).catch( err => {
                        reject(new Exception({ inner : err, log : `path : ${path}` }))
                    })

            } catch (ex) {
                reject(ex)
            }

        })
    },

    
    /**
     * Gets the contents of the index file. This is normally the .tuna.xml file in the dropbox folder root, but in
     * for dev purposes can also be:
     * - .tunaTest.xml on the dropbox root
     * - tuna.xml in the local /server/reference folder
     * - null, to simulate a user that has no index file.
     *
     * Returns null if no file found.
     */
    async getIndexFileContent(source, profileId){
        
        let accessToken = source.accessToken

        return new Promise(function(resolve, reject){

            // this is currently a known issue, and dropbox deals with the error badly, so try to catch it first
            if (!accessToken)
                return reject(new Exception({
                    log : 'getIndexFileContent received an empty dropbox access token, user data is likely corrupted'
                }))

            try {

                let dropbox = new Dropbox({ accessToken });
                                         
                // even thought Tuna index file is prefixed with '.' we omit that as it seems to confuse dropbox's api
                dropbox.filesSearch({ path : '', query : settings.indexImportMode === 'remoteTest' ? 'tunatest.xml' : 'tuna.xml' })
                    .then(function(data){
                        
                        logger.info.info(`Dropbox import mode : ${settings.indexImportMode}`)

                        if (data && data.matches && data.matches.length > 0){
                            let match = data.matches[0],
                                path = match.metadata.path_display

                            dropbox.filesDownload({ path : path }).then(function(data){
                                let decoded = new Buffer(data.fileBinary, 'binary').toString('utf8')
                                resolve(decoded);
                            }, function(err){
                                reject(err)
                            })

                        } else {
                            logger.info.info(`Dropbox import : No matches found.`);
                            resolve(null)
                        }

                    })
                    .catch(err => {
                        reject(err);
                    })

            } catch (ex) {
                reject(ex)
            }
        })
    },


    /**
     * Retrieves a raw token from a dropbox oauth response, verifies it, and stores the result to the profile
     */
    async swapCodeForToken(profileId, token){
        return new Promise(async (resolve, reject) => {

            try {
                // must do require here, if at start of file get close-file import tangle
                let profileLogic = require(_$+'logic/profiles'),
                    profile = await profileLogic.getById(profileId),
                    options = {
                        url : settings.dropboxDevOauthToken ? urljoin(settings.siteUrl, '/v1/dev/dropboxTokenSwap') : 'https://api.dropboxapi.com/oauth2/token',
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

                            let json = JsonHelper.parse(body)
                                // if dev token set, always use that
                                accessToken = settings.dropboxDevOauthToken || json.access_token

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
