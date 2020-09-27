const mocha = require(_$t+'helpers/testbase')

mocha('logic/songs/createMany', async(ctx)=>{

    it('logic/songs/createMany::happy    creates songs', async () => {
        let logic = require(_$+'logic/songs')

        ctx.inject.object(_$+'cache/songs', {
            createMany(songs){
                return songs
            }
        })

        const songs = await logic.createMany([{}])
        ctx.assert.single(songs)
    })




    it('logic/songs/createMany::unhappy    creates songs, songs undefined', async () => {
        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.createMany() )

        ctx.assert.equal(exception.log, 'Songs required')
    })




    it('logic/songs/createMany::unhappy    creates songs, songs collection empty', async () => {
        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.createMany([]) )
            
        ctx.assert.equal(exception.log, 'Songs required')
    })
})
