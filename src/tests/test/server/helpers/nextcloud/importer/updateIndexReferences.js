
const 
    mocha = require(_$t+ 'helpers/testbase'),
    constants = require(_$+'types/constants'),
    fs = require('fs-extra'),
    mock = require(_$t+'tests/server/helpers/nextcloud/importer/mock')

mocha('helpers/nextcloud/importer/getSource/updateIndexReferences', function(ctx){
    
    
    it('helpers/nextcloud/importer/getSource/updateIndexReferences::happy    should list multiple index files found', async () => {
        let importer = mock.happyPath()

        // body xml i reference xml for multiple search results
        importer.mockPostResponse.body = await fs.readFile(_$+'reference/nextcloud/multipleResults.xml', 'utf8')

        await importer._updateIndexReferences('123')

        // mock xml had 2 results in it, and known id 62599
        ctx.assert.length(importer.mockProfile.sources[constants.SOURCES_NEXTCLOUD].indexes, 2)
        ctx.assert.notNull(importer.mockProfile.sources[constants.SOURCES_NEXTCLOUD].indexes.find(item => item.fileid === '62599'))
    })




    it('helpers/nextcloud/importer/getSource/updateIndexReferences::unhappy    throws expected exception on invalid bearer token', async () => {
        let importer = mock.happyPath()

        // http call to nextcloud returns 401 code to simulate invalid bearer token
        importer.mockPostResponse.raw.statusCode = 401

        const exception = await ctx.assert.throws(async ()=> await importer._updateIndexReferences('123'))

        ctx.assert.equal(exception.log, '401 despite explicit token testing')
    })




    it('helpers/nextcloud/importer/getSource/updateIndexReferences::unhappy    marks profile\'s nextcloud source as broken if unexpected status code is returned', async () => {
        let importer = mock.happyPath()

        // http call to nextcloud returns 500, unexpected error
        importer.mockPostResponse.raw.statusCode = 500

        await importer._updateIndexReferences('123')

        // status flagged as broken
        ctx.assert.equal(importer.mockProfile.sources[constants.SOURCES_NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_USER_REAUTHORIZE)
    })




    it('helpers/nextcloud/importer/getSource/updateIndexReferences::unhappy    should gracefully handle no index files found', async () => {
        let importer = mock.happyPath()

        // force a bogus object into indexes, we want to confirm this has been deleted
        importer.mockProfile.sources[constants.SOURCES_NEXTCLOUD].indexes.push({})

        // body xml is reference XML for empty search results
        importer.mockPostResponse.body = await fs.readFile(_$+'reference/nextcloud/noResult.xml', 'utf8')

        await importer._updateIndexReferences('123')

        // indexes collection must be set to empty, but integration is working
        ctx.assert.empty(importer.mockProfile.sources[constants.SOURCES_NEXTCLOUD].indexes)
        ctx.assert.equal(importer.mockProfile.sources[constants.SOURCES_NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_WORKING)
    })
    
})

