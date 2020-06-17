const jsonHelper = require(_$+'helpers/json')

module.exports = { 

    bind(app){

        /**
         * Updates a profile
         */    
        app.post('/v1/profile', async function (req, res) {
            try {
                const
                    authHelper = require(_$+'helpers/authentication'),
                    profileLogic = require(_$+'logic/profiles'),
                    contentHelper = require(_$+'helpers/content'),
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
         * Must be anonymous, user cannot log in.
         */    
        app.get('/v1/profile/requestPassword', async function (req, res) {
            try {
                const 
                    bruteForce = require(_$+'helpers/bruteForce'),
                    profileLogic = require(_$+'logic/profiles'),
                    settings = require(_$+'helpers/settings'),
                    route = 'profile/requestPassword'

                await bruteForce.process({
                    request : req,
                    route : route,
                    threshold : settings.bruteForceThreshold,
                    period : settings.bruteForcePeriod,
                    cooldown : settings.bruteForceCooldown
                })

                const email = decodeURIComponent(req.query.email || '')
        
                await profileLogic.requestPasswordReset(settings.masterUsername, email)
                
                await bruteForce.clear({ request : req, route : route })

                jsonHelper.returnPayload(res)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })


        /**
         * Used by BOTH the normal change password page, and the emergency password recovery page.
         */    
        app.get('/v1/profile/resetPassword', async function (req, res) {
            try {
                let 
                    authHelper = require(_$+'helpers/authentication'),
                    bruteForce = require(_$+'helpers/bruteForce'),
                    profileLogic = require(_$+'logic/profiles'),
                    settings = require(_$+'helpers/settings'),
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


        /**
         * Finalizes profile delete. This will actually delete a profile, for real.
         * todo : turn into DELETE
         */
        app.get('/v1/profile/delete', async function (req, res) {
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    profileLogic = require(_$+'logic/profiles'),
                    authToken = await authHelper.authenticate(req),
                    key = req.query.key
            
                await profileLogic.processDeleteAccount(authToken.profileId, key)
            
                jsonHelper.returnPayload(res)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })   

        app.delete('/v1/profile/source', async function (req, res) {
            try {
                const 
                    authHelper = require(_$+'helpers/authentication'),
                    profileLogic = require(_$+'logic/profiles'),
                    contentHelper = require(_$+'helpers/content'),
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