describe('logic/songs/deleteForProfile', async()=>{

    it('logic/songs/deleteForProfile::happy::deletes songs for profile', async () => {
        const ctx = require(_$t+'testcontext')
        
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
