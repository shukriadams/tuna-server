module.exports = function(testPath){

    const 
        assert = require('madscience-node-assert'),
        MongoTester = require(_$t+'helpers/mongoTester'),
        mocha = require(_$t+'helpers/testbase');

    let mongoObject = require(_$+testPath);

    mocha(`${testPath}/deleteForProfile`, async(testArgs)=>{

        it(`${testPath}/deleteForProfile : happy path : objects are deleted`, async () => {
            
            await new MongoTester(mongoObject);
            await mongoObject.deleteForProfile('5e919d31c75024336d9a2a81');
            // nothing to test - if nothing thrown, test passes
        });
    
        it(`${testPath}/deleteForProfile : unhappy path : has err`, async () => {
            
            let mongoTester = await new MongoTester(mongoObject);
            // force error
            mongoTester.out.err = { thing : 2001 }
    
            let exception = await assert.throws(async ()=> { await mongoObject.deleteForProfile('5e919d31c75024336d9a2a81') });
            assert.equal(exception.inner.err.thing, 2001 );
        });
    
    });
}

