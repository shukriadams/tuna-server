/*

const 
    assert = require('madscience-node-assert'),
    route = require(_$+'routes/dropbox'),
    RouteTester = require(_$t+'helpers/routeTester'),
    mocha = require(_$t+'helpers/testbase');

mocha('route/dropbox/delete', async(testArgs)=>{

    
    it('happy path : route removes dropbox integration from profile and returns updated user content', async () => {
        
        let routeTester = await new RouteTester(route);

        routeTester.authenticate();        
        routeTester.setUserContent({ someUserContent : 'new content'});
        routeTester.route.profileLogic.removeDropbox =()=>{ } // do nothing

        await routeTester.get('/v1/dropbox/delete');

        assert.equal(routeTester.res.content.payload.someUserContent, 'new content');
    });

})

*/