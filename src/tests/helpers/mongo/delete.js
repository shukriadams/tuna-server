module.exports = function(testPath){

    const 
        assert = require('madscience-node-assert'),
        MongoTester = require(_$t+'helpers/mongoTester'),
        mocha = require(_$t+'helpers/testbase');

    let mongoObject = require(_$+testPath);

    mocha(`${testPath}/delete`, async(testArgs)=>{
    
        it(`${testPath}/delete : happy path : object is deleted`, async () => {
            
            await new MongoTester(mongoObject);
            await mongoObject.delete('5e919d31c75024336d9a2a81');
            // nothing to test - if nothing thrown, test passes
        });
       
        it(`${testPath}/delete : unhappy path : has err`, async () => {
            
            let mongoTester = await new MongoTester(mongoObject);
            // force error
            mongoTester.out.err = { thing : 1001 }
    
            let exception = await assert.throws(async ()=> { await mongoObject.delete('5e919d31c75024336d9a2a81') });
            assert.equal(exception.inner.err.thing, 1001 );
        });
    
    });
}

