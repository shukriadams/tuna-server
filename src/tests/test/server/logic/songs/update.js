describe('logic/songs/update', async()=>{

    it('logic/songs/update::happy::updates song', async () => {
        const ctx = require(_$t+'testcontext')
        
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
