module.exports = {

    async create(profileId, browserUID, userAgent){
        const 
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            AuthToken = require(_$+'types/authToken'),
            settings = require(_$+'helpers/settings'),
            cache = require(_$+'cache/authToken'),
            authToken = AuthToken.new()
    
        if (!profileId)
            throw new Exception({code : constants.ERROR_INVALID_ARGUMENT, message: 'missing profileid'})
    
        authToken.created = new Date().getTime()
        authToken.profileId = profileId
        authToken.context = browserUID
        authToken.userAgent = userAgent

        // delete sessio for current browser
        await cache.deleteForContext(profileId, browserUID)

        // ensure we don't exceed max allowed sessions
        let existingTokens = await cache.getForProfile(profileId)
        if (existingTokens.length > settings.maxSessionsPerUser){
            // sort newest first
            existingTokens.sort((a,b)=>{
                return a.created > b.created ? -1 :
                    a.created < b.created ? 1 :
                    0
            })
    
            existingTokens = existingTokens.slice(settings.maxSessionsPerUser)
    
            for (let deleteToken of existingTokens)
                await cache.delete(deleteToken.id)
            
        }
    
        return await cache.create(authToken)
    },
    
    
    async getForProfile(profileId){
        const cache = require(_$+'cache/authToken')
        return await cache.getForProfile(profileId)
    },


    async getById(key){
        const cache = require(_$+'cache/authToken')
        if (!key || key === 'null') // string null check if workaround for shitty stuff that should be properly fixed in frontend
            return null
    
        return await cache.getById(key)
    },
    
    
    /**
     * Deletes all tokens for a user
     */
    async deleteForProfile (profileId){
        const cache = require(_$+'cache/authToken')
        await cache.deleteForProfile(profileId)
    }
    
}
