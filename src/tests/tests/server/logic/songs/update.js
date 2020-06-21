const mocha = require(_$t+'helpers/testbase')

mocha('logic/songs/update', async(ctx)=>{

    it('happy path : updates song', async () => {
        ctx.inject.object(_$+'cache/songs', {
            update (song){
                return song
            }
        })

        const logic = require(_$+'logic/songs'),
            actualSong = await logic.update({ id : 'some-id'})

        ctx.assert.equal(actualSong.id, 'some-id')
    })
})
