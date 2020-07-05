
const route = require(_$+'routes/default'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase')

mocha('route/default/default', async(ctx)=>{

    // this is a simple route, it has only one outcome
    it('route/default/default::happy    returns html', async () => {

        let routeTester = await new RouteTester(route)

        await routeTester.get(/^[^.]+$/)

        ctx.assert.includes(routeTester.res.content, '<html>')
    })
    
})
