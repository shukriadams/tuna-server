const assert = require('madscience-node-assert')

describe('route/default/default', () => {
    it('route/default/default::happy::returns html', async () =>{
        
        const route = require(_$+'routes/default'),
            RouteTester = require(_$t+'helpers/routeTester')

        let routeTester = await new RouteTester(route)
        await routeTester.get(/^[^.]+$/)
        assert.includes(routeTester.res.content, '<html>')
    })


    /**
     * forced for coverage
     */
    it('route/default/default::unhappy::forced error', async () =>{
        const ctx = require(_$t+'testcontext')

        ctx.inject.object('handlebars', {
            compile : ()=>{
                throw 'whatever'
             } 
        })

        const route = require(_$+'routes/default'),
            constants = require(_$+'types/constants'),
            RouteTester = require(_$t+'helpers/routeTester'),
            routeTester = await new RouteTester(route)
        
        await routeTester.get(/^[^.]+$/)
        ctx.assert.equal(routeTester.res.content.code, constants.ERROR_DEFAULT)
    })
})
