module.exports = { 

    bind(app){

        const 
            settings = require(_$+'helpers/settings'),
            jsonHelper = require(_$+'helpers/json')

        // prevent binding of dev routes if not explicitly enabled in settings
        if (!settings.sandboxMode)
            return

        /**
         * Fakes 1st stage of Oauth flow for dropbox.
         */    
        app.get('/v1/sandbox/dropboxAuthenticate', async function (req, res) {
            try {
                const 
                    settings = require(_$+'helpers/settings'),
                    state = req.query.state || ''

                res.redirect(`${settings.siteUrl}/v1/oauth/dropbox?state=${state}&code=placeholder`)
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
        
        
        /**
         * Fakes 2nd stage of Oauth flow for dropbox.
         */    
        app.post('/v1/sandbox/dropboxTokenSwap', async function (req, res) {
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
         * simulates search api, always returns single result, equal to the file name being searched for
         */
        app.post('/v1/sandbox/dropbox/find/:query', async (req, res) =>{
            try {
                res.json({
                    matches : [{
                        metadata : {
                            path_display: req.params.query,
                        }
                    }]
                })
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        app.post('/v1/sandbox/dropbox/getTemporaryPath/:path', async (req, res)=>{
            try {
                const 
                    fsUtils = require('madscience-fsUtils'),
                    urljoin = require('urljoin'),
                    settings = require(_$+'helpers/settings'),                
                    files = await fsUtils.readFilesUnderDir(settings.musicSandboxFolder, false, '.mp3')

                if (!files.length)
                    return jsonHelper.returnException(res, `No local streamable files found - add mp3s to music sandbox folder`)

                const filename = files[Math.floor(Math.random() * files.length)]

                res.json({
                    link : urljoin(settings.siteUrl, `/v1/sandbox/dropbox/stream/${filename}`)
                })

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
        

        /**
         * streams a random file
         */
        app.get('/v1/sandbox/dropbox/stream/:file', async (req, res) =>{
            try {
                const fs = require('fs'),
                    readStream = fs.createReadStream(path.join(settings.musicSandboxFolder, req.params.file))

                // This will wait until we know the readable stream is actually valid before piping
                readStream.on('open', ()=>{
                    // This just pipes the read stream to the response object (which goes to the client)
                    readStream.pipe(res)
                })
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * simulates search/find api
         */
        app.post('/v1/sandbox/dropbox/getfile/:file', async (req, res) =>{
            try {
                let 
                    fs = require('fs'),
                    fileData = null

                if (req.params.file.includes('tuna.json'))
                    fileData = await fs.promises.readFile(_$+'reference/.tuna.json', 'utf8')
                else if (req.params.file.includes('tuna.dat'))
                    fileData = await fs.promises.readFile(_$+'reference/.tuna.dat', 'utf8')
                else
                    throw `cannot sandbox get ${req.params.file}`

                res.send(fileData)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Fakes 1st stage of Oauth flow for nextcloud.
         */    
        app.get('/v1/sandbox/nextcloudAuthenticate', async function (req, res) {
            try {
                const 
                    settings = require(_$+'helpers/settings'),
                    state = req.query.state || ''

                res.redirect(`${settings.siteUrl}/v1/oauth/nextcloud?state=${state}&code=placeholder`)
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Fakes 2nd stage of Oauth flow for nextcloud.
         */    
        app.post('/v1/sandbox/nextcloudTokenSwap', async function (req, res) {
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
         * simulates search/find api
         */
        app.get('/v1/sandbox/nextcloud/getfile/:file', async (req, res) =>{
            try {
                let 
                    fs = require('fs'),
                    Exception = require(_$+'types/exception'),
                    constants = require(_$+'types/constants'),
                    fileData = null

                if (req.params.file === '.tuna.json')
                    fileData = await fs.promises.readFile(_$+'reference/.tuna.json', 'utf8')
                else if (req.params.file === '.tuna.dat')
                    fileData = await fs.promises.readFile(_$+'reference/.tuna.dat', 'utf8')
                else
                    throw new Exception({ 
                        code: constants.ERROR_INVALID_ARGUMENT,
                        public : `cannot sandbox get ${req.params.file}`
                    })

                res.send(fileData)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * simulates search api, always returns single result
         */
        app.post('/v1/sandbox/nextcloud/find/:query', async (req, res) =>{
            res.send(`<d:multistatus xmlns:d="DAV:" xmlns:s="http://sabredav.org/ns" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
                <d:response>
                    <d:href>/remote.php/dav/files/dummyuser/.tuna.dat</d:href>
                    <d:propstat>
                        <d:prop>
                            <oc:fileid>62565</oc:fileid>
                        </d:prop>
                        <d:status>HTTP/1.1 200 OK</d:status>
                    </d:propstat>
                </d:response>
            </d:multistatus>`)
        })


        /**
         * streams a random file
         */
        app.get('/v1/sandbox/stream', async (req, res) =>{
            try {
                const fs = require('fs'), 
                    fsUtils = require('madscience-fsUtils'),
                    files = await fsUtils.readFilesUnderDir(settings.musicSandboxFolder, true, '.mp3')

                if (!files.length)
                    return jsonHelper.returnException(res, 'No local streamable files found - add music to music sandbox folder')

                const filename = files[Math.floor(Math.random() * files.length)],
                    readStream = fs.createReadStream(filename)

                // This will wait until we know the readable stream is actually valid before piping
                readStream.on('open', function () {
                    // This just pipes the read stream to the response object (which goes to the client)
                    readStream.pipe(res);
                })
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Fakes token refresh. 
         */
        app.post('/v1/sandbox/nextcloud/refresh', async (req, res) =>{
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
        app.get('/v1/sandbox/lastfmAuthenticate', async function (req, res) {
            try {
        
                const settings = require(_$+'helpers/settings'),
                    authToken = req.query.session
            
                res.redirect(`${settings.siteUrl}/v1/oauth/lastfm?token=placeholder&session=${authToken}`)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Fakes 2nd stage of Oauth flow for lastfm.
         */  
        app.get('/v1/sandbox/lastfmTokenSwap', async function (req, res) {
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


        /**
         * 
         */
        app.post('/v1/sandbox/lastfmScrobble', async function(req, res){
            try {
                res.send(
                    '<lfm status="ok">'+
                        '<scrobbles accepted="1" ignored="0">'+
                            '<scrobble>'+
                            '<track corrected="0">Test Track</track>'+
                            '<artist corrected="0">Test Artist</artist>'+
                            '<album corrected="0"></album>'+
                            '<albumArtist corrected="0"></albumArtist>'+
                            '<timestamp>1287140447</timestamp>'+
                            '<ignoredMessage code="0"></ignoredMessage>'+
                            '</scrobble>'+
                        '</scrobbles>'+
                    '</lfm>')
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


    }
}