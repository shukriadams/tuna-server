/**
 * 
 */
const 
    fs = require('fs'),
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
         * Reads sandbox version of .tuna.json. This is not used in dropbox mode, which loads the file directly.
         */
        app.get('/v1/dev/nextcloud/readStatus', async (req, res) =>{
            try {
                let fileData = fs.promises.readFile(_$+'reference/.tuna.json', 'utf8')
                res.send(fileData)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Reads sandbox version of .tuna.xml
         */
        app.get('/v1/dev/nextcloud/readIndex', async (req, res) =>{
            try {
                let fileData = await fs.promises.readFile(_$+'reference/.tuna.xml', 'utf8')
                res.send(fileData)

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