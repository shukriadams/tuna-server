describe('logic/playlog', async()=>{

    it('logic/playlog/page::happy::pages playlogs', async () => {
        const ctx = require(_$t+'testcontext')
        
        ctx.inject.object(_$+'cache/playlog', {
            page (){
                return { id : 'some-value' }
            }
        })

        const logic = require(_$+'logic/playlog'),
            result = await logic.page()

        ctx.assert.equal(result.id, 'some-value')
    })

})