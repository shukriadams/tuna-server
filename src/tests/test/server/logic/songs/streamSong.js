describe('logic/songs/streamSong', async()=>{

    it('logic/songs/streamSong::happy::streams song', async () => {
        let ctx = require(_$t+'testcontext'),
            actualProfileId,  
            actualMediaPath

        ctx.inject.object(_$+'helpers/sourceProvider', {
            getSource (){
                return {
                    streamMedia(profileId, mediaPath){
                        actualProfileId = profileId
                        actualMediaPath = mediaPath
                    }
                }
            }
        })

        const logic = require(_$+'logic/songs')
        await logic.streamSong('my-profile', 'my-media')

        ctx.assert.equal(actualProfileId, 'my-profile')
        ctx.assert.equal(actualMediaPath, 'my-media')        
    })
})
