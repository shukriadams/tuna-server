const mocha = require(_$t+'helpers/testbase')

mocha('logic/songs/streamSong', async(ctx)=>{

    it('happy path : streams song', async () => {
        let actualProfileId,  
            actualMediaPath

        ctx.inject.object(_$+'helpers/sourceProvider', {
            get (){
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
