describe('sources/provider/validateSettings', ()=>{
    
    it('sources/provider/validateSettings::unhappy::fails on invalid settings', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'lib/settings', {
            musicSource : 'some invalid source '
        })

        const sourceProvider = require(_$+'sources/provider'),
            exception = await ctx.assert.throws(async() => await sourceProvider.validate() )

        ctx.assert.notNull(exception)
    })
  
})

