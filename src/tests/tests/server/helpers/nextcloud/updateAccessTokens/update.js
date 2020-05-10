const 
    mocha = require(_$t+ 'helpers/testbase'),
    constants = require(_$+'types/constants'),
    updateAccessTokens = require(_$+'helpers/nextcloud/updateAccessTokens'),
    assert = require('madscience-node-assert');

function mock(){
    // deep clone  so we do't pollute across tests (mocha does not isolate) 
    let mock = Object.assign({}, updateAccessTokens);
    
    mock.mockProfile = { sources : { nextcloud : { 
        indexes : [],
        status : constants.SOURCE_CONNECTION_STATUS_WORKING,
        // set token date to expired
        tokenDate : new Date('1970-1-1').getTime(),
        expiresIn : 0 
    }}};
    mock.profileLogic.getById =()=>{ return mock.mockProfile }
    mock.profileLogic.update =(profile )=>{ mock.mockProfile = profile }

    mock.mockPostResponse = { raw : { }, body: { } };
    // default status code is success
    mock.mockPostUrlStringResponse = { raw : { statusCode : 200 }, body: { error : null } };
    mock.httputils.postUrlString =()=>{ return mock.mockPostUrlStringResponse };
    mock.httputils.post =()=>{ return mock.mockPostResponse };
    return mock;
}

mocha('test', function(testArgs){


    it('happypath : new bearer token is written to profile object', async () => {
        let updater = mock();

        // add new bearer token info to body content
        updater.mockPostUrlStringResponse.body = JSON.stringify({ 
            access_token : 'new_token', 
            refresh_token : 'new_refresh_token', 
            expires_in: 240 
        });

        // ensure token is very, very old
        assert.equal(updater.mockProfile.sources[constants.NEXTCLOUD].tokenDate, new Date('1970-1-1').getTime());

        await updater.update();

        assert.equal(updater.mockProfile.sources[constants.NEXTCLOUD].accessToken, 'new_token');
        assert.equal(updater.mockProfile.sources[constants.NEXTCLOUD].refreshToken, 'new_refresh_token');
        // 120 is the 2 minute safety margin we use when saving
        assert.equal(updater.mockProfile.sources[constants.NEXTCLOUD].expiresIn, 240-120); 
        // token date is at most 1 second old
        assert.true(updater.mockProfile.sources[constants.NEXTCLOUD].tokenDate > new Date(new Date().getTime() - 1000 ).getTime());
    });


    it('unhappypath : exits if token has not expired', async () => {
        let updater = mock();

        // set token date so it hasn't expired yet
        updater.mockProfile.sources[constants.NEXTCLOUD].tokenDate = new Date().getTime();
        updater.mockProfile.sources[constants.NEXTCLOUD].expiresIn = 9999998;
        // set token to null, this will be written if bearer is updated, we want to make sure that doesn't happen
        updater.mockProfile.sources[constants.NEXTCLOUD].accessToken = null;
        // have nextcloud approve token
        updater.mockPostResponse.raw.statusCode = 200;

        await updater.update();

        assert.null(updater.mockProfile.sources[constants.NEXTCLOUD].accessToken);
    });


    it('unhappypath : throws invalid json error on invalid json', async () => {
        let updater = mock();

        // set body response to be invalid json
        updater.mockPostUrlStringResponse.body = '---';

        const exception = await assert.throws(async() => await updater.update() );
        assert.equal(exception.inner.raw, '---');
        assert.equal(exception.log, 'Response contained invalid json');
    });


    it('unhappypath : invalid_request response flags source as broken', async () => {
        let updater = mock();

        // set body response to 'invalid_request', this is known to happen with unvalid refresh tokens
        updater.mockPostUrlStringResponse.body = JSON.stringify({ 
            error : 'invalid_request' 
        });

        // ensure that connection is valid
        assert.equal(updater.mockProfile.sources[constants.NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_WORKING);

        await updater.update();

        // connection flagged as broken
        assert.equal(updater.mockProfile.sources[constants.NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_USER_REAUTHORIZE );
    });


    it('unhappypath : status 400 flags source as broken', async () => {
        let updater = mock();

        // set body response to 'invalid_request', this is known to happen with unvalid refresh tokens
        updater.mockPostUrlStringResponse.raw.statusCode = 400;

        // ensure that connection is valid
        assert.equal(updater.mockProfile.sources[constants.NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_WORKING);

        await updater.update();

        // connection flagged as broken
        assert.equal(updater.mockProfile.sources[constants.NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_USER_REAUTHORIZE );
    });


    it('unhappypath : unexpected error content throws exception', async () => {
        let updater = mock();

        // set body response to 'invalid_request', this is known to happen with unvalid refresh tokens
        updater.mockPostUrlStringResponse.body = JSON.stringify({ 
            error : '1234' 
        });

        // ensure that connection is valid
        assert.equal(updater.mockProfile.sources[constants.NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_WORKING);

        const exception = await assert.throws(async() => await updater.update() );

        assert.equal(exception.code, constants.ERROR_DEFAULT);

        // ensure that connection is still marked as valid
        assert.equal(updater.mockProfile.sources[constants.NEXTCLOUD].status, constants.SOURCE_CONNECTION_STATUS_WORKING);
    });

    
    it('unhappypath : throw an exception during token check', async () => {
        let updater = mock();

        // set tokens to not expired
        updater.mockProfile.sources[constants.NEXTCLOUD].tokenDate = new Date().getTime();
        updater.mockProfile.sources[constants.NEXTCLOUD].expiresIn = 9999998;
        // force post to throw something
        updater.httputils.post = function(){ throw '1234' };

        const exception = await assert.throws(async() => await updater.update() );

        assert.equal(exception.log, 'Unexpected error doing token check');
        assert.equal(exception.inner, '1234' );
    });

    it('unhappypath : error 401 on token check forces token update', async () => {
        let updater = mock();

        // make token brand new and expires way off in future
        updater.mockPostUrlStringResponse.body = JSON.stringify({ 
            tokenDate : new Date().getTime(),
            expiresIn : 9999999 
        });
        // nextcloud uses this as indicator token expired
        updater.mockPostResponse.raw.statusCode = 401;
        // calling postUrlString proves that token update was attempted, use this as landmark reach proof
        updater.httputils.postUrlString = ()=>{ throw 'this was reached'; }

        const exception = await assert.throws(async() => await updater.update() );

        assert.equal(exception, 'this was reached');
    });
});    