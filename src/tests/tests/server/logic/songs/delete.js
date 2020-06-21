const mocha = require(_$t+'helpers/testbase')

mocha('logic/songs/delete', async(ctx)=>{

    it('happy path : delete song', async () => {
        ctx.inject.object(_$+'cache/songs', {
            delete (song){
                return song
            }
        })

        const logic = require(_$+'logic/songs'),
            actualSong = await logic.delete({ id : 'some-glfsgfsg-dfd'})

        ctx.assert.equal(actualSong.id, 'some-glfsgfsg-dfd')
    })
})
