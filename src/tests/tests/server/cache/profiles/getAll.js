const mocha = require(_$t+'helpers/testbase')

mocha('cache/profiles/getAll', async(ctx)=>{

    it('cache/profiles/getAll::happy    gets all profiles', async () => {
        // replace call to mongo
        ctx.inject.object(_$+'data/mongo/profile', {
            getAll (){
                return { id : 'some-id3' }
            }
        })

        const profilesCache = require(_$+'cache/profile'),
            profiles = await profilesCache.getAll()

        ctx.assert.equal(profiles.id, 'some-id3')
    })

})
