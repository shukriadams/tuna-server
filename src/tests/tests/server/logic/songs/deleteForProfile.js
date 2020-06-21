const mocha = require(_$t+'helpers/testbase')

mocha('logic/songs/deleteForProfile', async(ctx)=>{

    it('logic/songs/deleteForProfile::happy    deletes songs for profile', async () => {
        ctx.inject.object(_$+'cache/songs', {
            deleteForProfile (song){
                return song
            }
        })

        const logic = require(_$+'logic/songs'),
            actualSong = await logic.deleteForProfile({ id : 'some-id-dfd'})

        ctx.assert.equal(actualSong.id, 'some-id-dfd')
    })
})
