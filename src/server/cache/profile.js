module.exports = {

    _getIdKey(profileId){
        return `profile_id_${profileId}`  
    },

    async create(record){
        const
            profileData = require(_$+'data/mongo/profile'),
            cache = require(_$+'helpers/cache'),
            profile = await profileData.create(record),
            key = this._getIdKey(profile.id)

        await cache.add(key, JSON.stringify(profile))
        return profile
    },

    async getById(profileId){
        const 
            profileData = require(_$+'data/mongo/profile'),
            JsonHelper = require(_$+'helpers/json'),
            cache = require(_$+'helpers/cache'),
            key = this._getIdKey(profileId),
            reply = await cache.get(key)

        if (reply)
            return (JsonHelper.parse(reply))
    
        let profile = await profileData.getById(profileId)
        if (profile)
            await cache.add(key, JSON.stringify(profile))

        return profile
    },


    /**
     * no caching on this
     */
    async getAll(){
        const profileData = require(_$+'data/mongo/profile')

        return await profileData.getAll()
    },

    
    async getByIdentifier(identifier){
        const profileData = require(_$+'data/mongo/profile')

        return profileData.getByIdentifier(identifier)
    },
    
    
    async getByPasswordResetKey(key){
        const profileData = require(_$+'data/mongo/profile')

        return profileData.getByPasswordResetKey(key)
    },
    

    async update(profile){
        const 
            cache = require(_$+'helpers/cache'),
            profileData = require(_$+'data/mongo/profile')

        await profileData.update(profile)
        let key = this._getIdKey(profile.id)
        await cache.add(key, JSON.stringify(profile))
    },
    
    
    async delete (profile){
        const 
            cache = require(_$+'helpers/cache'),
            profileData = require(_$+'data/mongo/profile')

        await profileData.delete(profile)
        let key = this._getIdKey(profile.id)
        await cache.remove(key)
    }
    
}