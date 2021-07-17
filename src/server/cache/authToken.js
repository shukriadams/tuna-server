module.exports = {
    
    _getIdKey(tokenId){
        return `authToken_${tokenId}`  
    },
    

    /**
     * 
     */
    async create(record){
        const authTokenData = require(_$+'data/mongo/authToken'),
            cache = require(_$+'lib/cache'),
            authToken = await authTokenData.create(record),
            key = this._getIdKey(authToken.id)

        await cache.add(key, JSON.stringify(authToken))
        return authToken
    },
    

    /**
     * bypasses cache
     */
    async getForProfile(profileId){
        const authTokenData = require(_$+'data/mongo/authToken')

        return await authTokenData.getForProfile(profileId)
    },
    

    /**
     * 
     */
    async getById(tokenId){
        // try to get authoken from cache
        const authTokenData = require(_$+'data/mongo/authToken'),
            cache = require(_$+'lib/cache'),
            JsonHelper = require(_$+'lib/json'),
            key = this._getIdKey(tokenId),
            authTokenJson = await cache.get(key)

        if (authTokenJson)
            return JsonHelper.parse(authTokenJson)

        const authToken = await authTokenData.getById(tokenId)

        // get authtoken from data layer, while caching
        await cache.add(key, JSON.stringify(authToken))
        return authToken
    },
    

    /**
     * 
     */
    async delete(id){
        const authTokenData = require(_$+'data/mongo/authToken'),
            cache = require(_$+'lib/cache')

        await cache.remove(this._getIdKey(id))
        await authTokenData.delete(id)
    },
   

    /**
     * Warning - no cache cleanup on these!
     */
    async deleteForProfile(profileId){
        const authTokenData = require(_$+'data/mongo/authToken')

        // don't do anything with cache, let records timeout
        await authTokenData.deleteForProfile(profileId)
    },


    /**
     * 
     */
    async deleteForContext(profileId, context){
        const authTokenData = require(_$+'data/mongo/authToken')

        // don't do anything with cache, let records timeout
        await authTokenData.deleteForContext(profileId, context)
    }
}