
const assert = require('madscience-node-assert')

function mock(){

    // deep clone  so we do't pollute across tests (mocha does not isolate) 
    let constants = require(_$+'types/constants'),
        inject = require(_$t+'helpers/inject'),
        nextCloudCommon = require(_$+'sources/nextcloud/common'),
        mock = Object.assign({}, nextCloudCommon)
    
    mock.mockProfile = { sources : { nextcloud : { 
        indexes : [],
        status : constants.SOURCE_CONNECTION_STATUS_WORKING,
        // set token date to expired
        tokenDate : new Date('1970-1-1').getTime(),
        expiresIn : 0 
    }}}
    
    inject.object(_$+'logic/profiles', {
        getById : ()=>{ 
            return mock.mockProfile 
        },
        update : (profile)=>{ 
            mock.mockProfile = profile 
        }
    })

    inject.object('madscience-httputils', {
        postUrlString : ()=> mock.mockPostUrlStringResponse ,
        post : ()=> mock.mockPostResponse 
    })

    mock.mockPostResponse = { raw : { }, body: { } }
    // default status code is success
    mock.mockPostUrlStringResponse = { raw : { statusCode : 200 }, body: { error : null } }

    return mock
}


describe('sources/nextcloud/importer/updateAccessTokens/update', function(testArgs){


    it('sources/nextcloud/importer/updateAccessTokens::happypath::new bearer token is written to profile object', async () => {

        let updater = mock(),
            constants = require(_$+'types/constants'),
            ctx = require(_$t+'testcontext')

        // add new bearer token info to body content
        updater.mockPostUrlStringResponse.body = JSON.stringify({ 
            access_token : 'new_token', 
            refresh_token : 'new_refresh_token', 
            expires_in : 240 
        })

        // ensure token is very, very old
        assert.equal(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].tokenDate, new Date('1970-1-1').getTime())

        await updater.ensureTokensAreUpdated()

        assert.equal(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].accessToken, 'new_token')
        assert.equal(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].refreshToken, 'new_refresh_token')
        // 120 is the 2 minute safety margin we use when saving
        assert.equal(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].expiresIn, 240-120)
        // token date is at most 1 second old
        assert.true(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].tokenDate > new Date(new Date().getTime() - 1000 ).getTime())
    })
    

    it('sources/nextcloud/importer/updateAccessTokens::unhappypath::exits if token has not expired', async () => {
        let ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants'),
            updater = mock()

        // set token date so it hasn't expired yet
        updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].tokenDate = new Date().getTime()
        updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].expiresIn = 9999998
        // set token to null, this will be written if bearer is updated, we want to make sure that doesn't happen
        updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].accessToken = null
        // have nextcloud approve token
        updater.mockPostResponse.raw.statusCode = 200

        await updater.ensureTokensAreUpdated()

        assert.null(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].accessToken)
    })

    

    it('sources/nextcloud/importer/updateAccessTokens::unhappypath::throws invalid json error on invalid json', async () => {
        let ctx = require(_$t+'testcontext'),
            updater = mock()

        // set body response to be invalid json
        updater.mockPostUrlStringResponse.body = '---'

        const exception = await assert.throws(async() => await updater.ensureTokensAreUpdated() )
        assert.equal(exception.inner.raw, '---')
        assert.equal(exception.log, 'invalid JSON string')
    })


    it('sources/nextcloud/importer/updateAccessTokens::unhappypath::invalid_request response flags source as broken', async () => {
        let ctx = require(_$t+'testcontext'),
            constants = require(_$+'types/constants'),
            updater = mock()

        // set body response to 'invalid_request', this is known to happen with unvalid refresh tokens
        updater.mockPostUrlStringResponse.body = JSON.stringify({ 
            error : 'invalid_request' 
        })

        // ensure that connection is valid
        assert.equal(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_WORKING)

        await updater.ensureTokensAreUpdated()

        // connection flagged as broken
        assert.equal(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_USER_REAUTHORIZE )
    })


    it('sources/nextcloud/importer/updateAccessTokens::unhappypath::status 400 flags source as broken', async () => {
        let updater = mock(),
            constants = require(_$+'types/constants')

        // set body response to 'invalid_request', this is known to happen with unvalid refresh tokens
        updater.mockPostUrlStringResponse.raw.statusCode = 400

        // ensure that connection is valid
        assert.equal(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_WORKING)

        await updater.ensureTokensAreUpdated()

        // connection flagged as broken
        assert.equal(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_USER_REAUTHORIZE )
    })


    it('sources/nextcloud/importer/updateAccessTokens::unhappypath::unexpected error content throws exception', async () => {
        let updater = mock(),
            constants = require(_$+'types/constants')

        // set body response to 'invalid_request', this is known to happen with unvalid refresh tokens
        updater.mockPostUrlStringResponse.body = JSON.stringify({ 
            error : '1234' 
        })

        // ensure that connection is valid
        assert.equal(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_WORKING)

        const exception = await assert.throws(async() => await updater.ensureTokensAreUpdated() )

        assert.equal(exception.code, constants.ERROR_DEFAULT)

        // ensure that connection is still marked as valid
        assert.equal(updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_WORKING)
    })


    it('sources/nextcloud/importer/updateAccessTokens::unhappypath::throw an exception during token check', async () => {
        let updater = mock(),
            inject = require(_$t+'helpers/inject'),
            constants = require(_$+'types/constants')

        // set tokens to not expired
        updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].tokenDate = new Date().getTime()
        updater.mockProfile.sources[constants.SOURCES_NEXTCLOUD].expiresIn = 9999998

        // force post to throw something
        inject.object('madscience-httputils', {
            post : function(){ throw '1234' }
        })

        const exception = await assert.throws(async() => await updater.ensureTokensAreUpdated() )

        assert.equal(exception.log, 'Unexpected error doing token check')
        assert.equal(exception.inner, '1234' )
    })


    it('sources/nextcloud/importer/updateAccessTokens::unhappypath::error 401 on token check forces token update', async () => {
        let updater = mock(),
            inject = require(_$t+'helpers/inject')

        // make token brand new and expires way off in future
        updater.mockPostUrlStringResponse.body = JSON.stringify({ 
            tokenDate : new Date().getTime(),
            expiresIn : 9999999 
        })

        // nextcloud uses this as indicator token expired
        updater.mockPostResponse.raw.statusCode = 401

        // calling postUrlString proves that token update was attempted, use this as landmark reach proof
        inject.object('madscience-httputils', {
            postUrlString : ()=>{ throw 'this was reached' }
        })

        const exception = await assert.throws(async() => await updater.ensureTokensAreUpdated() )

        assert.equal(exception, 'this was reached')
    })

})