const 
    constants = require(_$+'types/constants'),
    mocha = require(_$t+'helpers/testbase'),
    mock = require(_$t+'tests/server/helpers/nextcloud/importer/mock'),
    assert = require('madscience-node-assert')


mocha('test : /helpers/nextcloud/function:getSource', function(testArgs){


    it('happy path : return profile and source', async () => {
        let importer = mock.happyPath()

        let result = async ()=> await importer._getSource('123')

        assert.notNull(result.profile)
        assert.notNull(result.source)
    })


    it('unhappypath : throws expected exception on invalid profile', async () => {
        let importer = mock.happyPath()

        // profile logic always returns null
        importer.profileLogic.getById = () =>{ return null }

        const exception = await assert.throws(async () => await importer._getSource('123'))
        assert.equal(exception.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })


    it('unhappypath : throws expected exception on profile with no nextcloud source', async () => {
        let importer = mock.happyPath()

        //profile logic returns a profile with no source.nextcloud
        importer.profileLogic.getById = () =>{ return { sources : { } } }

        const exception = await assert.throws(async ()=> await importer._getSource('123'))
        assert.equal(exception.code, constants.ERROR_INVALID_SOURCE_INTEGRATION)
    })
    
})

