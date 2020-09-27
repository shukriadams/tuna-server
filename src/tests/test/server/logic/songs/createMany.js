describe('logic/songs/createMany', async()=>{

    it('logic/songs/createMany::happy::creates songs', async () => {
        let ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/songs')

        ctx.inject.object(_$+'cache/songs', {
            createMany(songs){
                return songs
            }
        })

        const songs = await logic.createMany([{}])
        ctx.assert.single(songs)
    })




    it('logic/songs/createMany::unhappy::creates songs, songs undefined', async () => {
        const ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.createMany() )

        ctx.assert.equal(exception.log, 'Songs required')
    })




    it('logic/songs/createMany::unhappy::creates songs, songs collection empty', async () => {
        const ctx = require(_$t+'testcontext'),
            logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.createMany([]) )
            
        ctx.assert.equal(exception.log, 'Songs required')
    })
})
