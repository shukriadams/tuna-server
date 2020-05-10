module.exports = (testPath, methodName)=>{

    const 
        assert = require('madscience-node-assert'),
        MongoTester = require(_$t+'helpers/mongoTester'),
        mocha = require(_$t+'helpers/testbase');

    let mongoObject = require(_$+testPath);

    mocha(`${testPath}/${methodName}`, async(testArgs)=>{

        it(`${testPath}/${methodName} : happy path : object is created`, async () => {
            let mongoTester = await new MongoTester(mongoObject);
            mongoTester.out.result = { _id : 'bur'}
            let result = await mongoObject[methodName]('123');
            assert.equal(result[0].id, 'bur');
        });
        
        it(`${testPath}/${methodName} : unhappy path : has err`, async () => {
            
            let mongoTester = await new MongoTester(mongoObject);
            
            // force error
            mongoTester.out.err = { thing : 1201 }
    
            let exception = await assert.throws(async ()=> { await mongoObject[methodName]('123') });
            assert.equal(exception.inner.err.thing, 1201 );
        });
    });
}

