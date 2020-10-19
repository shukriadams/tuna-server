describe('helpers/sourceProvider/validateSettings', ()=>{
    
    it('helpers/sourceProvider/validateSettings::unhappy::fails on invalid settings', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'helpers/settings', {
            musicSource : 'some invalid source '
        })

        const sourceProvider = require(_$+'helpers/sourceProvider'),
            exception = await ctx.assert.throws(async() => await sourceProvider.validate() )

        ctx.assert.notNull(exception)
    })
  
})

