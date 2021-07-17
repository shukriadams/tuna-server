describe('route/sandbox/nextcloudTokenSwap', async()=>{
    
    it('route/sandbox/nextcloudfind::happy::returns search result', async () => {
        const ctx = require(_$t+'testcontext'),
            RouteTester = require(_$t+'lib/routeTester')

        // enable sandbox mode to allow sandbox route binding
        ctx.inject.object(_$+'lib/settings', {
            sandboxMode : true
        })
        
        const route = require(_$+'routes/sandbox'),
            routeTester = await new RouteTester(route)

        await routeTester.post('/v1/sandbox/nextcloud/find/:query')

        // confirm presence of known string in result
        ctx.assert.includes(routeTester.res.content, '<oc:fileid>62565</oc:fileid>')
    })

})

