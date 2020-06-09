/*
const 
    mocha = require(_$t+ 'helpers/testbase'),
    constants = require(_$+'types/constants'),
    fs = require('fs-extra'),
    mock = require(_$t+'tests/server/helpers/nextcloud/importer/mock'),
    assert = require('madscience-node-assert')

mocha('test : /helpers/nextcloud/function:updateIndexReferences', function(testArgs){
    
    
    it('happypath : should list multiple index files found', async () => {
        let importer = mock.happyPath();

        // body xml i reference xml for multiple search results
        importer.mockPostResponse.body = await fs.readFile(_$+'reference/nextcloud/multipleResults.xml', 'utf8');

        await importer._updateIndexReferences('123');

        // mock xml had 2 results in it, and known id 62599
        assert.length(importer.mockProfile.sources[constants.NEXTCLOUD].indexes, 2);
        assert.notNull(importer.mockProfile.sources[constants.NEXTCLOUD].indexes.find(item => item.fileid === '62599'));
    });


    it('unhappypath : throws expected exception on invalid bearer token', async () => {
        let importer = mock.happyPath();

        // http call to nextcloud returns 401 code to simulate invalid bearer token
        importer.mockPostResponse.raw.statusCode = 401;

        const exception = await assert.throws(async ()=> await importer._updateIndexReferences('123'));

        assert.equal(exception.log, '401 despite explicit token testing');
    });


    it('unhappypath : marks profile\'s nextcloud source as broken if unexpected status code is returned', async () => {
        let importer = mock.happyPath();

        // http call to nextcloud returns 500, unexpected error
        importer.mockPostResponse.raw.statusCode = 500;

        await importer._updateIndexReferences('123');

        // status flagged as broken
        assert.equal(importer.mockProfile.sources[constants.NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_USER_REAUTHORIZE);
    });


    it('unhappypath : should gracefully handle no index files found', async () => {
        let importer = mock.happyPath();

        // force a bogus object into indexes, we want to confirm this has been deleted
        importer.mockProfile.sources[constants.NEXTCLOUD].indexes.push({});

        // body xml is reference XML for empty search results
        importer.mockPostResponse.body = await fs.readFile(_$+'reference/nextcloud/noResult.xml', 'utf8');

        await importer._updateIndexReferences('123');

        // indexes collection must be set to empty, but integration is working
        assert.empty(importer.mockProfile.sources[constants.NEXTCLOUD].indexes);
        assert.equal(importer.mockProfile.sources[constants.NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_WORKING);
    });
    
})

*/