module.exports = {

    bind(app){

        const jsonHelper = require(_$+'lib/json')

        /**
         * Logs a user in. Returns a full user session, including all user songs
         */
        app.post('/v1/session', async function (req, res) {
            __log.info(`ROUTE:/v1/session`)

            try {
                const bruteForce = require(_$+'lib/bruteForce'),
                    settings = require(_$+'lib/settings'),
                    authTokenLogic = require(_$+'logic/authToken'),
                    profileLogic = require(_$+'logic/profiles'),
                    route = 'sessions/post'

                await bruteForce.process({
                    request : req,
                    route : route,
                    threshold : settings.bruteForceThreshold,
                    period : settings.bruteForcePeriod,
                    cooldown : settings.bruteForceCooldown
                })
            
                const profileId = await profileLogic.authenticate(req.body.username, req.body.password),
                    authToken = await authTokenLogic.create(profileId, req.body.browserUID, req.get('User-Agent'))
            
                await bruteForce.clear({ request : req, route : route })
                
                return jsonHelper.returnPayload(res, { authToken : authToken.id })
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * returns true if a session is valid. this is done on client load, and a relog is forced if this returns false
         */    
        app.get('/v1/session', async function (req, res) {
            __log.info(`ROUTE:/v1/session`)

            try {
                let authTokenLogic = require(_$+'logic/authToken'),
                    profileLogic = require(_$+'logic/profiles'),
                    tokenRecord = await authTokenLogic.getById(req.query.token || ''),
                    isValid = false
        
                // confirm both token and profile, token might be orphaned cache instance
                if (tokenRecord){
                    // confirm session
                    const profile = await profileLogic.getById(tokenRecord.profileId)
                    isValid = !!profile

                    // confirm songs
                    if (isValid)
                        isValid = await profileLogic.songsHashValid(tokenRecord.profileId, req.query.hash || '')
                }

                jsonHelper.returnPayload(res, { isValid })
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
    }
}