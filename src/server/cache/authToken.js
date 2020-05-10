const 
    authTokenData = require(_$+'data/mongo/authToken'),
    JsonHelper = require(_$+'helpers/json'),
    cache = require(_$+'helpers/cache')

module.exports = {

    _getIdKey(tokenId){
        return 'authToken_' + tokenId
    },
    
    async create(record){
    
        let authToken = await authTokenData.create(record)
    
        let key = this._getIdKey(authToken.id)
        await cache.add(key, JSON.stringify(authToken))
        return authToken
    },
    

    /**
     * bypasses cache
     */
    async getForProfile(profileId){
        return await authTokenData.getForProfile(profileId)
    },
    

    async getById(tokenId){
        // try to get authoken from cache
        let key = this._getIdKey(tokenId)
        let authTokenJson = await cache.get(key)
        if (authTokenJson)
            return JsonHelper.parse(authTokenJson)
    
        // get authtoken from data layer, while caching
        let authToken = await authTokenData.getById(tokenId)
        await cache.add(key, JSON.stringify(authToken))
        return authToken
    },
    

    async delete(id){
        await cache.remove(this._getIdKey(id))
        await authTokenData.delete(id)
    },
   

    // warning - no cache cleanup on these!
    async deleteForProfile(profileId){
        // don't do anything with cache, let records timeout
        await authTokenData.deleteForProfile(profileId)
    },

    async deleteForContext(profileId, context){
        // don't do anything with cache, let records timeout
        await authTokenData.deleteForContext(profileId, context)
    }
}