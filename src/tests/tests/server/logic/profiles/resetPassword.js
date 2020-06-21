const mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/resetPassword', async(ctx)=>{

    it('logic/profiles/resetPassword::happy    requests password reset, key given', async () => {
        let updatedProfile = null

        ctx.inject.object(_$+'cache/profile', {
            getByPasswordResetKey(){
                return {}
            }
        })

        ctx.inject.object(_$+'cache/profile', {
            update (profile){
                updatedProfile = profile
            }
        })

        let logic = require(_$+'logic/profiles')
        await logic.resetPassword('my-key', 'my-password', 'my-currentPassword')
        ctx.assert.notNull(updatedProfile)
    })




    it('logic/profiles/resetPassword::happy    requests password reset, profileId given', async () => {
        let updatedProfile = null

        ctx.inject.object(_$+'cache/profile', {
            getById (){
                return {}
            }
        })

        ctx.inject.object(_$+'cache/profile', {
            update (profile){
                updatedProfile = profile
            }
        })

        ctx.inject.object(_$+'logic/profiles', {
            _isPasswordValid (){
                return true
            }
        })

        let logic = require(_$+'logic/profiles')
        await logic.resetPassword(null, 'my-password', 'my-currentPassword', 'my-profile-idd')
        ctx.assert.notNull(updatedProfile)
    })




    it('logic/profiles/resetPassword::unhappy    requests password reset, no profile found', async () => {
        ctx.inject.object(_$+'cache/profile', {
            getById (){
                return null
            }
        })

        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.resetPassword(null, 'my-password', 'my-currentPassword', 'my-profile-idd') )

        ctx.assert.equal(exception.public, 'Invalid session')
    })




    it('logic/profiles/resetPassword::unhappy    requests password reset, session instead of key, password invalid', async () => {

        ctx.inject.object(_$+'cache/profile', {
            getById (){
                return {}
            }
        })

        ctx.inject.object(_$+'logic/profiles', {
            _isPasswordValid (){
                return false
            }
        })

        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.resetPassword(null, 'my-password', 'my-currentPassword', 'my-profile-idd') )

        ctx.assert.equal(exception.public, 'Current password is invalid')
    })
})
