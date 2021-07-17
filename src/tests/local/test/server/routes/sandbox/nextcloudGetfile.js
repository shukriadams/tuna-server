describe('route/sandbox/nextcloudGetfile', async()=>{
    
    it('route/sandbox/nextcloudGetfile::happy::gets metadata  file', async () => {
        const ctx = require(_$t+'testcontext'),
            RouteTester = require(_$t+'lib/routeTester')

        // enable sandbox mode to allow sandbox route binding
        ctx.inject.object(_$+'lib/settings', {
            sandboxMode : true
        })
        
        const route = require(_$+'routes/sandbox'),
            routeTester = await new RouteTester(route)

        routeTester.req.params.file = '.tuna.json'

        await routeTester.get('/v1/sandbox/nextcloud/getfile/:file')
        // confirm that endpoint returns known hash in tuna.json reference file
        ctx.assert.equal(JSON.parse(routeTester.res.content).hash, '085ec35f02ea4c4f6afc0e20872420bf')
    })

    it('route/sandbox/nextcloudGetfile::happy::gets index file', async () => {
        const ctx = require(_$t+'testcontext'),
            RouteTester = require(_$t+'lib/routeTester')

        // enable sandbox mode to allow sandbox route binding
        ctx.inject.object(_$+'lib/settings', {
            sandboxMode : true
        })
        
        const route = require(_$+'routes/sandbox'),
            routeTester = await new RouteTester(route)

        routeTester.req.params.file = '.tuna.dat'

        await routeTester.get('/v1/sandbox/nextcloud/getfile/:file')
        // testing index is tricky as it doesn't contain standard json, for a fast and dirty test we look for a known value that
        // occurs at the end of the index
        ctx.assert.includes(routeTester.res.content, 'Way Farer')
    })

    it('route/sandbox/nextcloudGetfile::unhappy::invalid file requested', async () => {
        const ctx = require(_$t+'testcontext')

        // enable sandbox mode to allow sandbox route binding
        ctx.inject.object(_$+'lib/settings', {
            sandboxMode : true
        })
        
        const constants = require(_$+'types/constants'),
            RouteTester = require(_$t+'helpers/routeTester'),
            route = require(_$+'routes/sandbox'),
            routeTester = await new RouteTester(route)

        routeTester.req.params.file = 'something-random-thats-invalid'

        await routeTester.get('/v1/sandbox/nextcloud/getfile/:file')
        ctx.assert.equal(routeTester.res.content.code, constants.ERROR_INVALID_ARGUMENT)

    })

})

