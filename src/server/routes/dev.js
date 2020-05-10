/**
 * 
 */
const 
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