const mocha = require(_$t+'helpers/testbase')

mocha('logic/songs/getAll', async(ctx)=>{

    it('logic/songs/getAll::happy    gets all songs for profile', async () => {
        let actualProfileId
        
        ctx.inject.object(_$+'cache/songs', {
            getAll (profileId){
                actualProfileId = profileId
                return [{ id : 'my-song'}]
            }
        })

        const logic = require(_$+'logic/songs'),
            songs = await logic.getAll('my-profile123')

        ctx.assert.equal(actualProfileId, 'my-profile123')
        ctx.assert.equal(songs[0].id, 'my-song')
    })
})
