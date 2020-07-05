const constants = require(_$+'types/constants'),
    mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/deleteSource', async(ctx)=>{

    it('logic/profiles/deleteSource::happy    delete source', async () => {
        let calls=0

        ctx.inject.object(_$+'cache/profile', {
            getById (){
                return {}
            }, 
            update(profile){
                actualProfile = profile
                calls++
            }
        })

        ctx.inject.object(_$+'logic/songs', {
            deleteForProfile(){
                calls++
            }
        })

        ctx.inject.object(_$+'logic/playlists', {
            deleteAll(){
                calls++
            }
        })

        const logic = require(_$+'logic/profiles')
        await logic.deleteSource('my-profile')

        ctx.assert.equal(calls, 3)
        ctx.assert.equal(JSON.stringify(actualProfile.sources), JSON.stringify({}))
    })


    

    it('logic/profiles/deleteSource::unhappy    delete source, profile not found', async () => {

        ctx.inject.object(_$+'cache/profile', {
            getById (){
                return null
            }
        })

        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.deleteSource('my-profile') )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })


})
