module.exports = { 

    bind(app){

        const jsonHelper = require(_$+'lib/json')

        /**
         * Updates a profile
         */    
        app.post('/v1/profile', async function (req, res) {
            __log.info(`ROUTE:/v1/profile`)

            try {
                const authHelper = require(_$+'lib/authentication'),
                    profileLogic = require(_$+'logic/profiles'),
                    contentHelper = require(_$+'lib/content'),
                    authToken = await authHelper.authenticate(req),
                    profileData = Object.assign({ id : authToken.profileId }, req.body)

                await profileLogic.updateProperties(profileData)

                const session = await contentHelper.build(authToken.profileId, authToken.id, 'profile')

                jsonHelper.returnPayload(res, session)
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Used by BOTH the normal change password page, and the emergency password recovery page.
         */    
        app.get('/v1/profile/resetPassword', async function (req, res) {
            __log.info(`ROUTE:/v1/profile/resetPassword`)

            try {
                let authHelper = require(_$+'lib/authentication'),
                    bruteForce = require(_$+'lib/bruteForce'),
                    profileLogic = require(_$+'logic/profiles'),
                    settings = require(_$+'lib/settings'),
                    route = 'profile/resetPassword',
                    key = req.query.key,
                    currentPassword = req.query.currentPassword,
                    authToken = null,
                    profileId = null,
                    password = req.query.password

                await bruteForce.process({
                    request : req,
                    route : route,
                    threshold : settings.bruteForceThreshold,
                    period : settings.bruteForcePeriod,
                    cooldown : settings.bruteForceCooldown
                })
            
                // if no key set, assume user is logged in and trying for change password; enforce auth
                if (!key){
                    authToken = await authHelper.authenticate(req)
                    profileId = authToken.profileId
                }

                await profileLogic.resetPassword(key, password, currentPassword, profileId)
            
                await bruteForce.clear({ request : req, route : route })
            
                jsonHelper.returnPayload(res)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        app.delete('/v1/profile/source', async function (req, res) {
            __log.info(`ROUTE:/v1/profile/source`)

            try {
                const authHelper = require(_$+'lib/authentication'),
                    profileLogic = require(_$+'logic/profiles'),
                    contentHelper = require(_$+'lib/content'),
                    authToken = await authHelper.authenticate(req)
            
                await profileLogic.deleteSource(authToken.profileId)
            
                const session = await contentHelper.build(authToken.profileId, authToken.id, 'songs,playlists,profile')
                jsonHelper.returnPayload(res, session)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })  
        

    }
}