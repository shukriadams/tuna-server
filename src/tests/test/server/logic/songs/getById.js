describe('logic/songs/getSongUrl', async(ctx)=>{

    /**
     * This test is mainly to hit the last line of the method for code coverage
     */
    it('logic/songs/getById::happy::gets song by id', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'cache/songs', {
            getAll(){
                return [{ id : 123}]
            }
        })

        const logic = require(_$+'logic/songs'),
            song = await logic.getById(123)

        ctx.assert.equal(song.id, 123)
    })

})
