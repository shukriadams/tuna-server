const constants = require(_$+'types/constants'),
    mocha = require(_$t+'helpers/testbase')

mocha('logic/songs/getSongUrl', async(ctx)=>{

    it('logic/songs/getSongUrl::happy    gets song url', async () => {

        ctx.inject.object(_$+'helpers/sourceProvider', {
            get(){
                return {
                    getFileLink(){
                        return 'my-url'
                    }
                }
            }
        })

        ctx.inject.object(_$+'logic/profiles', {
            getById(){
                return { }
            }
        })

        ctx.inject.object(_$+'logic/songs', {
            _getById(){
                return { }
            }
        })

        const logic = require(_$+'logic/songs'),
            url = await logic.getSongUrl('songId', 'profileId', 'authTokenId')

        ctx.assert.equal(url, 'my-url')
    })




    it('logic/songs/getSongUrl::unhappy    no profile found', async () => {

        ctx.inject.object(_$+'helpers/sourceProvider', {
            get(){
                return {
                    getFileLink(){
                        return 'my-url'
                    }
                }
            }
        })

        // return no profile to trigger exception
        ctx.inject.object(_$+'logic/profiles', {
            getById(){
                return null
            }
        })

        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.getSongUrl('songId', 'profileId', 'authTokenId') )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })




    it('logic/songs/getSongUrl::unhappy    no song found', async () => {

        ctx.inject.object(_$+'helpers/sourceProvider', {
            get(){
                return {
                    getFileLink(){
                        return 'my-url'
                    }
                }
            }
        })

        ctx.inject.object(_$+'logic/profiles', {
            getById(){
                return { }
            }
        })

        // return no song to trigger exception
        ctx.inject.object(_$+'logic/songs', {
            _getById(){
                return null
            }
        })

        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.getSongUrl('songId', 'profileId', 'authTokenId') )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_SONG)
    })

})
