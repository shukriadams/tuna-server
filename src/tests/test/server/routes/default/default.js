const assert = require('madscience-node-assert')

describe('route/default/default', () => {
    it('route/default/default::happy::returns html', async () =>{
        
        const ctx = require(_$t+'testcontext'),
            route = require(_$+'routes/default'),
            RouteTester = require(_$t+'helpers/routeTester')

        let routeTester = await new RouteTester(route)
        await routeTester.get(/^[^.]+$/)
        assert.includes(routeTester.res.content, '<html>')
    })
})
