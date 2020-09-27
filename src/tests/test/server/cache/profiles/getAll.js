describe('cache/profiles/getAll', async()=>{

    it('cache/profiles/getAll::happy::gets all profiles', async () => {
        const ctx = require(_$t+'testcontext')

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
