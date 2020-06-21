const constants = require(_$+'types/constants'),
    mocha = require(_$t+'helpers/testbase')

mocha('logic/songs/nowPlaying', async(ctx)=>{

    it('logic/songs/nowPlaying::happy    registers currently playing song', async () => {
        // return a profile, this is required to proceed
        ctx.inject.object(_$+'logic/profiles', {
            getById (){
                return { }
            }
        })

        // return a song
        ctx.inject.object(_$+'logic/songs', {
            _getById (){
                return { }
            }
        })

        // update on lastfm
        ctx.inject.object(_$+'helpers/lastfm', {
            nowPlaying (){
                return 'updated-on-last-fm'
            }
        })
        
        const logic = require(_$+'logic/songs'),
            status = await logic.nowPlaying()

        ctx.assert.equal(status, 'updated-on-last-fm')
    })



    
    it('logic/songs/nowPlaying::unhappy    no profile found', async () => {
        // return null profile to trigger exception
        ctx.inject.object(_$+'logic/profiles', {
            getById (){
                return null
            }
        })

        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.nowPlaying() )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })




    it('logic/songs/nowPlaying::unhappy    no song found', async () => {
        // return a profile, this is required to proceed
        ctx.inject.object(_$+'logic/profiles', {
            getById (){
                return { }
            }
        })

        // return no song to trigger exception
        ctx.inject.object(_$+'logic/songs', {
            _getById (){
                return null
            }
        })

        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.nowPlaying() )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_SONG)
    })
})
