/**
 * 
 */
const 
    fs = require('fs'),
    fsUtils = require('madscience-fsUtils'),
    settings = require(_$+'helpers/settings'),
    jsonHelper = require(_$+'helpers/json')

module.exports = { 
    
    settings,

    bind(app){

        // prevent binding of dev routes if not explicitly enabled in settings
        if (!settings.enableDevRoutes)
            return


        /**
         * Fakes 1st stage of Oauth flow for dropbox.
         */    
        app.get('/v1/dev/dropboxAuthenticate', async function (req, res) {
            try {
                let state = req.query.state || ''
            
                res.redirect(`${settings.siteUrl}/v1/oauth/dropbox?state=${state}&code=placeholder`)
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
        
        
        /**
         * Fakes 2nd stage of Oauth flow for dropbox.
         */    
        app.post('/v1/dev/dropboxTokenSwap', async function (req, res) {
            try {
                res.send({
                    access_token: 'placeholder', 
                    token_type: 'bearer', 
                    account_id: 'dbid:whatever', 
                    uid: '12345' 
                })

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        
        /**
         * Fakes 1st stage of Oauth flow for nextcloud.
         */    
        app.get('/v1/dev/nextcloudAuthenticate', async function (req, res) {
            try {
                const state = req.query.state || ''

                res.redirect(`${settings.siteUrl}/v1/oauth/nextcloud?state=${state}&code=placeholder`)
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Fakes 2nd stage of Oauth flow for nextcloud.
         */    
        app.post('/v1/dev/nextcloudTokenSwap', async function (req, res) {
            try {

                res.send({
                    access_token: 'placeholder', 
                    token_type: 'bearer', 
                    account_id: 'dbid:whatever', 
                    uid: '12345' 
                })

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
        
        /**
         * Returns sandbox index result - this doesn't point to an actual index file, querying the actual fule in sandbox mode will always return placeholder index data (see
         * '/v1/dev/nextcloud/readIndex' below)
         */
        app.post('/v1/dev/nextcloud/findIndices', async (req, res) =>{
            try {

                res.send(`<d:multistatus xmlns:d="DAV:" xmlns:s="http://sabredav.org/ns" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
                    <d:response>
                        <d:href>/remote.php/dav/files/admin/test/another/.tuna.xml</d:href>
                        <d:propstat>
                            <d:prop>
                                <oc:fileid>62599</oc:fileid>
                            </d:prop>
                            <d:status>HTTP/1.1 200 OK</d:status>
                        </d:propstat>
                    </d:response>
                    <d:response>
                        <d:href>/remote.php/dav/files/placeholderContent/.tuna.xml</d:href>
                        <d:propstat>
                            <d:prop>
                                <oc:fileid>62565</oc:fileid>
                            </d:prop>
                            <d:status>HTTP/1.1 200 OK</d:status>
                        </d:propstat>
                    </d:response>
                </d:multistatus>`)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * simulates search/find api
         */
        app.get('/v1/dev/nextcloud/getfile/:file', async (req, res) =>{
            try {
                let fileData = null

                if (req.params.file === '.tuna.json')
                    fileData = fs.promises.readFile(_$+'reference/.tuna.json', 'utf8')
                else if (req.params.file === '.tuna.xml')
                    fileData = await fs.promises.readFile(_$+'reference/.tuna.xml', 'utf8')
                else
                    throw `cannot sandbox get ${req.params.file}`

                res.send(fileData)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * simulates search api, always returns single result
         */
        app.post('/v1/dev/nextcloud/find/:query', async (req, res) =>{
            try {
                res.send(`<d:multistatus xmlns:d="DAV:" xmlns:s="http://sabredav.org/ns" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
                <d:response>
                    <d:href>/remote.php/dav/files/dummyuser/.tuna.xml</d:href>
                    <d:propstat>
                        <d:prop>
                            <oc:fileid>62565</oc:fileid>
                        </d:prop>
                        <d:status>HTTP/1.1 200 OK</d:status>
                    </d:propstat>
                </d:response>
            </d:multistatus>`)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * streams a random file
         */
        app.get('/v1/dev/nextcloud/stream', async (req, res) =>{
            try {
                const files = await fsUtils.readFilesUnderDir(_$+'reference/music', true, '.mp3')
                if (!files.length)
                    return jsonHelper.returnException(res, 'No local streamable files found - add mp3s to /src/reference/music folder')

                const filename = files[Math.floor(Math.random() * files.length)],
                    readStream = fs.createReadStream(filename)

                // This will wait until we know the readable stream is actually valid before piping
                readStream.on('open', function () {
                    // This just pipes the read stream to the response object (which goes to the client)
                    readStream.pipe(res);
                });
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Fakes token refresh. 
         */
        app.post('/v1/dev/nextcloud/refresh', async (req, res) =>{
            try {
                
                res.json({
                    access_token : 'abcdefg',
                    token_type: 'Bearer',
                    expires_in: 3600,
                    refresh_token : '12345456',
                    user_id : 'dummyusername'
                })

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Fakes 1st stage of Oauth flow for lastfm.
         */
        app.get('/v1/dev/lastfmAuthenticate', async function (req, res) {
            try {
        
                const authToken = req.query.session
            
                res.redirect(`${settings.siteUrl}/v1/oauth/lastfm?token=placeholder&session=${authToken}`)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Fakes 2nd stage of Oauth flow for lastfm.
         */  
        app.post('/v1/dev/lastfmTokenSwap', async function (req, res) {
            try {
            
                res.send(
                    '<lfm status="ok">' +
                    '<session>' +
                    '<name>placeholder</name>' +
                    `<key>placeholder</key>` +
                    '<subscriber>0</subscriber>' +
                    '</session>' +
                    '</lfm>')

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })

    }
}