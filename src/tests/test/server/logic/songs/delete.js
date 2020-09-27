describe('logic/songs/delete', async()=>{

    it('logic/songs/delete::happy::delete song', async () => {
        const ctx = require(_$t+'testcontext')
        
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
