describe('logic/songs/persistSong', async(ctx)=>{

    it('logic/songs/persistSong::happy::persists song', async () => {
        let ctx = require(_$t+'testcontext'),
            persistedSong

        ctx.inject.object(_$+'logic/songs', {
            getById(){
                return {
                    foo : 'foo'
                }
            },
            update(song){
                persistedSong = song
            }
        })

        const logic = require(_$+'logic/songs')
        await logic.persistSong(JSON.stringify({ foo : 'bar', thing: 'stuff'}), 'my-profile')

        ctx.assert.equal(persistedSong.foo, 'bar')
        // thing must not be persisted as it doesn't exist in server-side object
        ctx.assert.true(persistedSong.thing === undefined)
    })



    
    it('logic/songs/persistSong::unhappy::persists song', async () => {
        let ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants')

        ctx.inject.object(_$+'logic/songs', {
            // return no song to trigger exception
            getById(){
                return null
            }
        })

        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.persistSong(JSON.stringify({ foo : 'bar', thing: 'stuff'}), 'my-profile') )
        
        ctx.assert.equal(exception.code, constants.ERROR_INVALID_SONG)
    })    
})
