const 
    mocha = require(_$t+'helpers/testbase'),
    requireMock = require(_$t+'helpers/require'),
    authTokenCache = require(_$+'cache/authToken')

/**
 * Tests common getSource function
 */
mocha('test : /helpers/nextcloud/function:getSource', function(testArgs){

    it('happy path : return profile and source', async () => {
        requireMock.enable()
        requireMock.add(_$+'data/mongo/authToken', {
            create : ()=>{
                console.log('create mock works')
                return {
                    id : 'test'
                }
            }
        })
        
        authTokenCache.create()
    })

    
})