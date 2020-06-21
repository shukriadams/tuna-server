const mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/requestPasswordReset', async(ctx)=>{

    it('logic/profiles/requestPasswordReset::happy    requests password reset', async () => {
        let updatedProfile,
            sentEmail = null,
            sentSubject = null,
            sentBody = null

        ctx.inject.function(_$+'helpers/sendgrid', (email, subject, body)=>{
            sentEmail = email
            sentSubject = subject
            sentBody = body
        })

        ctx.inject.object(_$+'cache/profile', {
            update(profile){
                updatedProfile = profile
            },
            getByIdentifier (profileId){
                return { profileId, email : 'me@me.me' }
            }
        })

        const logic = require(_$+'logic/profiles')
        await logic.requestPasswordReset('some-id', 'me@me.me')
            
        ctx.assert.equal(updatedProfile.profileId, 'some-id')
        ctx.assert.notNull(sentEmail)
        ctx.assert.notNull(sentSubject)
        ctx.assert.notNull(sentBody)
    })



    
    it('logic/profiles/requestPasswordReset::unhappy    profile not found', async () => {
        ctx.inject.object(_$+'cache/profile', {
            getByIdentifier (){
                return null
            }
        })

        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.requestPasswordReset('some-id', 'me@me.me') )
            
        ctx.assert.equal(exception.public, 'That email address isn\'t bound to an account.')
    })




    it('logic/profiles/requestPasswordReset::unhappy    profile has no email', async () => {
        ctx.inject.object(_$+'cache/profile', {
            getByIdentifier (profileId){
                return { profileId, email : null }
            }
        })

        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.requestPasswordReset('some-id', 'me@me.me') )
        
        ctx.assert.equal(exception.public, 'Your account doesn\t have an email address. Please reset password directly (see Tuna "help" guide for more info)')
    })




    it('logic/profiles/requestPasswordReset::unhappy    profile email doesn\'t match security email' , async () => {
        ctx.inject.object(_$+'cache/profile', {
            getByIdentifier (profileId){
                return { profileId, email : 'something invalid' }
            }
        })

        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.requestPasswordReset('some-id', 'me@me.me') )
            
        ctx.assert.equal(exception.public, 'The email address you gave was not found. Please reset password directly (see Tuna "help" guide for more info)')
    })

})
