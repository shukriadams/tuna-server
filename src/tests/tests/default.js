const assert = require('madscience-node-assert')
require('./testcontext')

describe('route/default/default', () => {
    it('route/default/default::happy::returns html', async () =>{

        const route = require(_$+'routes/default'),
            RouteTester = require(_$t+'helpers/routeTester')

        let routeTester = await new RouteTester(route)
        await routeTester.get(/^[^.]+$/)
        assert.includes(routeTester.res.content, '<html>')
    })

    it('route/default/default::happy::passes', async () =>{
        assert.true(true)
    })
})
