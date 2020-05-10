const 
    profileData = require(_$+'data/mongo/profile'),
    JsonHelper = require(_$+'helpers/json'),
    cache = require(_$+'helpers/cache')

module.exports = {

    _getIdKey(profileId){
        return 'profile_id_' + profileId
    },


    async getById(profileId){
        let key = this._getIdKey(profileId)
        let reply = await cache.get(key)
        if (reply)
            return (JsonHelper.parse(reply))
    
        let profile = await profileData.getById(profileId)
        if (profile)
            await cache.add(key, JSON.stringify(profile))

        return profile
    },

    
    async create(record){
        let profile = await profileData.create(record)
        let key = this._getIdKey(profile.id)
        await cache.add(key, JSON.stringify(profile))
        return profile
    },


    /**
     * no caching on this
     */
    async getAll(){
        return await profileData.getAll()
    },

    
    async getByIdentifier(identifier){
        return profileData.getByIdentifier(identifier)
    },
    
    
    async getByPasswordResetKey(key){
        return profileData.getByPasswordResetKey(key)
    },
    

    async update(profile){
        await profileData.update(profile)
        let key = this._getIdKey(profile.id)
        await cache.add(key, JSON.stringify(profile))
    },
    
    
    async delete (profile){
        await profileData.delete(profile)
        let key = this._getIdKey(profile.id)
        await cache.remove(key)
    }
    
}