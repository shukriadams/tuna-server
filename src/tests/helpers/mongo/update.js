module.exports = (testPath)=>{

    let
        assert = require('madscience-node-assert'),
        MongoTester = require(_$t+'helpers/mongoTester'),
        mocha = require(_$t+'helpers/testbase');

    let mongoObject = require(_$+testPath);

    mocha(`${testPath}/update`, async(testArgs)=>{
        
        it(`${testPath}/update : happy path : object is updated`, async () => {
            await new MongoTester(mongoObject);
            let result = await mongoObject.update({ id : '5e919d31c75024336d9a2a81'});
            // updated passes-through the object being updated
            assert.equal(result.id, '5e919d31c75024336d9a2a81');
        });

        it(`${testPath}/update : unhappy path : has err`, async () => {
            
            let mongoTester = await new MongoTester(mongoObject);
            // force error
            mongoTester.out.err = { thing : 4569 }

            let exception = await assert.throws(async ()=> { await mongoObject.update({ id : '5e919d31c75024336d9a2a81'}) })

            assert.equal(exception.inner.err.thing, 4569 );
        });

    });
}
