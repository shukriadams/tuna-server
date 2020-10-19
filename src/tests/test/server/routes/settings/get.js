describe('route/settings/get', async()=>{
    
    it('route/settings/get::happy::gets settings', async () => {
        const ctx = require(_$t+'testcontext')

        ctx.inject.object(_$+'helpers/sourceProvider', {
            getSource (){ 
                return {
                    getLabel(){ return 5678 }
                }
            }
        }) 

        const route = require(_$+'routes/settings'),
            RouteTester = require(_$t+'helpers/routeTester'),
            routeTester = await new RouteTester(route)

        await routeTester.get('/v1/settings')
        ctx.assert.equal(routeTester.res.content.payload.sourceLabel, 5678 )
    })

    
    /**
     * Force an error to be sure that error handling code in route is covered
     */
    it('route/settings/get::unhappy::forced error', async () => {
        const ctx = require(_$t+'testcontext')
        ctx.inject.object(_$+'helpers/sourceProvider', {
            getSource(){
                throw 'whatever'
            }
        })

        const route = require(_$+'routes/settings'),
            constants = require(_$+'types/constants'),
            RouteTester = require(_$t+'helpers/routeTester'),
            routeTester = await new RouteTester(route)

        await routeTester.get('/v1/settings')
        ctx.assert.equal(routeTester.res.content.code, constants.ERROR_DEFAULT)
    })
})
