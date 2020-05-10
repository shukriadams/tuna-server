const mocha = require(_$t+ 'helpers/testbase'),
    nextCloudCloneSource = require(`${_$}helpers/nextcloud/common`),
    assert = require('madscience-node-assert');

/**
 * Sets up a CLONE of nextCloudHelper with mocks of data/functions needed for a happy path result.
 */
function mockHappyPath(){
    // clone nextCloudHelper so we don't contaminate source with mocks
    let nextCloudHelper = Object.assign({}, nextCloudCloneSource);
    
    // replace functions with happy path things

    return nextCloudHelper;
}

mocha('test : /helpers/nextcloud/function:example', function(testArgs){
    
    it('happypath : example', async () => {
        let nextCloudHelper = mockHappyPath();

        // override happy path stuff if needed

        // do

        // assert
        assert.true(true);
    });



    
});