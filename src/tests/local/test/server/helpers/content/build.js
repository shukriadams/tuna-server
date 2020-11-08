describe('helpers/content/build', function(){

    it('helpers/content/build::happy::builds content', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'logic/playlists', {
            getAll (){ 
                return 'some-playlist'
            } 
        })

        ctx.inject.object(_$+'logic/profiles', {
            getById (){ 
                return {
                    sources : {
                        dropbox : {

                        }
                    }
                }
            } 
        })

        const contentHelper = require(_$+'helpers/content'),
            content = await contentHelper.build('profileId', 'authTokenId', 'playlists, profile')

        ctx.assert.equal(content.playlists, 'some-playlist')
    })



    it('helpers/content/build::unhappy::no profile', async () => {
        const ctx = require(_$t+'testcontext')
       
        ctx.inject.object(_$+'logic/profiles', {
            getById (){ 
                return null
            } 
        })

        const contentHelper = require(_$+'helpers/content'),
            constants = require(_$+'types/constants'),
            exception = await ctx.assert.throws(async() => await contentHelper.build('profileId', 'authTokenId', 'playlists') )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })

})

