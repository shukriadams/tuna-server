require('./testcontext')

describe('example', function () {
    it('demonstrates how to requiremock a core type', async () => {

        const requireMock = require(_$t+'helpers/require'),
            authTokenCache = require(_$+'cache/authToken')

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
