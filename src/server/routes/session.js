const jsonHelper = require(_$+'helpers/json')

module.exports = {

    bind(app){


        /**
         * Logs a user in. Returns a full user session, including all user songs
         */
        app.post('/v1/session', async function (req, res) {
            try {
                const 
                    bruteForce = require(_$+'helpers/bruteForce'),
                    settings = require(_$+'helpers/settings'),
                    authTokenLogic = require(_$+'logic/authToken'),
                    contentHelper = require(_$+'helpers/content'),
                    profileLogic = require(_$+'logic/profiles')
                    route = 'sessions/post'

                await bruteForce.process({
                    request : req,
                    route : route,
                    threshold : settings.bruteForceThreshold,
                    period : settings.bruteForcePeriod,
                    cooldown : settings.bruteForceCooldown
                });
            
                // todo : too much going on here, can we simplify this?
                let profileId = await profileLogic.authenticate(settings.masterUsername, req.body.password),
                    authToken = await authTokenLogic.create(profileId, req.body.browserUID, req.get('User-Agent')),
                    content = await contentHelper.build(authToken.profileId, authToken.id, 'songs,playlists,profile')
            
                await bruteForce.clear({ request : req, route : route })
            
                return jsonHelper.returnPayload(res, content)
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        });


        /**
         * tests if a session is valid. this is done on client load, and a relog is forced if this returns false
         */    
        app.get('/v1/session/isvalid', async function (req, res) {
            try {
                let 
                   authTokenLogic = require(_$+'logic/authToken'),
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