module.exports = function(testPath){

    const 
        assert = require('madscience-node-assert'),
        MongoTester = require(_$t+'helpers/mongoTester'),
        mocha = require(_$t+'helpers/testbase');

    let mongoObject = require(_$+testPath);
        
    mocha(`${testPath}/createMany`, async(testArgs)=>{
        

        it(`${testPath}/createMany : happy path : objects are created`, async () => {
            await new MongoTester(mongoObject);
            let result = await mongoObject.createMany([{ name : '123'}, { name : '456' }]);
            // returns number of records recreated
            assert.equal(result, 2);
        });
    

        it(`${testPath}/create : unhappy path : has err`, async () => {
            
            let mongoTester = await new MongoTester(mongoObject);
            // force error
            mongoTester.out.err = { thing : 4568 }

            let exception = await assert.throws(async ()=> { await mongoObject.createMany([{ name : '123'}, { name : '456' }]) })

            assert.equal(exception.inner.err.thing, 4568 );
        });

    });
}
