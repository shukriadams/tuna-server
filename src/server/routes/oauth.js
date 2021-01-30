

module.exports = {

    bind(app){

        /**
         * Oauth "catchers" - receives incoming oauth redirects from external sites, exchanges oauth codes for tokens, then
         * redirects to local pages to complete oauth flow.
         */
        const jsonHelper = require(_$+'helpers/json')

        /**
         * Starts music source oauth flow
         */
        app.get('/v1/oauth/source/start', async (req, res)=>{
            __log.info(`ROUTE:/v1/oauth/source/start`)
           
            let authHelper = require(_$+'helpers/authentication'),
                sourceProvider = require(_$+'sources/provider'),
                settings = require(_$+'helpers/settings'),
                authToken = await authHelper.authenticateTokenString(req.query.token),
                url = sourceProvider.getSource().getOauthUrl(authToken.id)

            if (settings.demoMode)
                return res.redirect('/')  

            if (req.query.origin)
                url = url.replace('TARGETPAGE', req.query.origin)

            res.redirect(url)
        })


        /**
         * Starts last fm oauth flow
         */
        app.get('/v1/oauth/lastfm/start', async (req, res)=>{
            __log.info(`ROUTE:/v1/oauth/lastfm/start`)

            const authHelper = require(_$+'helpers/authentication'),
                lastFmHelper = require(_$+'helpers/lastfm'),
                settings = require(_$+'helpers/settings'),
                authToken = await authHelper.authenticateTokenString(req.query.token)

            if (settings.demoMode)
                return res.redirect('/')  

            res.redirect(lastFmHelper.getOauthUrl(authToken.id))
        })


        /**
         * Receives auth code from nextcloud. this must be exchanged for a token.
         * This route handler is anonymous - authtoken will be passed back as the querystring "state".
         */    
        app.get('/v1/oauth/nextcloud', async function (req, res) {
            __log.info(`ROUTE:/v1/oauth/nextcloud`)

            try {

                // todo : ensure referrer is localhost or dropbox.com

                // state contains two values, authTokenId, and the page the user was on when starting the authorization process
                const constants = require(_$+'types/constants'),
                    Exception = require(_$+'types/exception'),
                    nextCloudHelper = require(_$+'sources/nextcloud/helper'),
                    authTokenLogic = require(_$+'logic/authToken'),
                    settings = require(_$+'helpers/settings'),
                    code = req.query.code,
                    state = (req.query.state || '').split('_'),
                    authTokenId = state.length > 1 ? state[0] : null,
                    targetPage = state.length > 1 ? state[1] : null,
                    authToken = await authTokenLogic.getById(authTokenId)

                if (settings.demoMode)
                    return res.redirect('/')  

                if (!authToken)
                    throw new Exception({ 
                        code: constants.ERROR_INVALID_USER_OR_SESSION,
                        log : `Invalid authToken received from nextcloud`,
                        forceLog : true,
                        inner : {
                            authTokenId
                        }
                    })
                    
                await nextCloudHelper.swapCodeForToken(authToken.profileId, code)
                res.redirect(`/${targetPage}`)
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Receives auth code from dropbox. this must be exchanged for a token
         * This route handler is anonymous - authtoken will be passed back via state.
         */
        app.get('/v1/oauth/dropbox', async function(req, res){
            __log.info(`ROUTE:/v1/oauth/dropbox`)

            try {
                // todo : ensure referrer is localhost or dropbox.com

                const constants = require(_$+'types/constants'),
                    Exception = require(_$+'types/exception'),
                    dropboxHelper = require(_$+'sources/dropbox/helper'),
                    authTokenLogic = require(_$+'logic/authToken'),
                    settings = require(_$+'helpers/settings'),
                    code = req.query.code,
                    state = (req.query.state || '').split('_'),
                    authTokenId = state.length > 1 ? state[0] : null,
                    targetPage = state.length > 1 ? state[1] : null,
                    authToken = await authTokenLogic.getById(authTokenId)

                if (settings.demoMode)
                    return res.redirect('/')  

                if (!authToken)
                    throw new Exception({ 
                        code: constants.ERROR_INVALID_USER_OR_SESSION,
                        log : `Invalid authToken received from dropbox`,
                        forceLog : true,
                        inner : {
                            authTokenId
                        }
                    })

                await dropboxHelper.swapCodeForToken(authToken.profileId, code)
                res.redirect(`/${targetPage}`)
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Receives auth code from lastfm. this must be exchanged for a token
         * This route handler is anonymous - authtokenId will be passed back via state.
         */
        app.get('/v1/oauth/lastfm', async function(req, res){
            __log.info(`ROUTE:/v1/oauth/lastfm`)

            try {
                // todo : ensure referrer is localhost or lastfm.com
            
                const lastFmHelper = require(_$+'helpers/lastfm'),
                    constants = require(_$+'types/constants'),
                    Exception = require(_$+'types/exception'),
                    authTokenLogic = require(_$+'logic/authToken'),
                    settings = require(_$+'helpers/settings'),
                    scrobbleToken = req.query.token,
                    authTokenId = req.query.session,
                    authToken = await authTokenLogic.getById(authTokenId)
                    
                if (settings.demoMode)
                    return res.redirect('/')  

                if (!authToken)
                    throw new Exception({ 
                        code: constants.ERROR_INVALID_USER_OR_SESSION,
                        log : `Invalid authToken received from dropbox`,
                        forceLog : true,
                        inner : {
                            authTokenId
                        }
                    })

                await lastFmHelper.swapCodeForToken(authToken.profileId, scrobbleToken)
                res.redirect(`/reload`)
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
        
    }
}