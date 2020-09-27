const mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/autoCreateMaster', async(ctx)=>{

    it('logic/profiles/autoCreateMaster::happy::creates master profile', async () => {

        ctx.suppressLogs()

        // replace call to mongo
        let logic = require(_$+'logic/profiles')

        // need to have both of these defined for autocreate to work
        ctx.inject.object(_$+'helpers/settings', {
            masterUsername : 'bob',
            masterDefaultPassword : 'bobword'
        })

        ctx.inject.object(_$+'logic/profiles', {
            getByIdentifier (){
                return null
            }
        })

        ctx.inject.object(_$+'cache/profile', {
            create (profile){
                return profile
            }
        })

        const profile = await logic.autoCreateMaster()
        ctx.assert.equal(profile.identifier, 'bob')
        ctx.assert.true(!profile.password) 
        ctx.assert.true(!!profile.hash) 
        ctx.assert.true(!!profile.salt) 
    })
})
