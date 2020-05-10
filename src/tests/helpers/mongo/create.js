module.exports = function(testPath){

    const 
        assert = require('madscience-node-assert'),
        constants = require(_$+'types/constants'),
        MongoTester = require(_$t+'helpers/mongoTester'),
        mocha = require(_$t+'helpers/testbase');

    let mongoObject = require(_$+testPath);
        
    mocha(`${testPath}/create`, async(testArgs)=>{
        

        it(`${testPath}/create : happy path : object is created`, async () => {
            let mongoTester = await new MongoTester(mongoObject);
            mongoTester.out.result = { _id : 'bur'}
            let result = await mongoObject.create({});
            assert.equal(result.id, 'bur');
        });
    

        it(`${testPath}/create : unhappy path : call with no object`, async () => {
            await new MongoTester(mongoObject);
            let exception = await assert.throws(async ()=> { await mongoObject.create() })
            assert.equal(exception.code, constants.ERROR_INVALID_ARGUMENT)
        });


        it(`${testPath}/create : unhappy path : has err`, async () => {
            
            let mongoTester = await new MongoTester(mongoObject);
            // force error
            mongoTester.out.err = { thing : 4567 }

            let exception = await assert.throws(async ()=> { await mongoObject.create({}) })

            assert.equal(exception.inner.err.thing, 4567 );
        });


        it(`${testPath}/create : unhappy path : has no result`, async () => {
            
            await new MongoTester(mongoObject);

            let exception = await assert.throws(async ()=> { await mongoObject.create({}) })

            assert.empty(exception.inner.result.ops);
        });

    });
}
