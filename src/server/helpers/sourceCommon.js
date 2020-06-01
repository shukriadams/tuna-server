const
    profileLogic = require(_$+'logic/profiles'),
    settings = require(_$+'helpers/settings'),
    jsonHelper = require(_$+'helpers/json'),
    constants = require(_$+'types/constants')

module.exports = {
    async isRemoteNewer(profileId, sourceCommon){
        const profile = await profileLogic.getById(profileId)
        if (!profile)
            throw new Exception({
                code : constants.ERROR_INVALID_USER_OR_SESSION
            })

        const source = profile.sources[settings.musicSource]
        if (!source)
            throw new Exception({
                code : constants.ERROR_INVALID_SOURCE_INTEGRATION
            })

        // must ensure tokens before attempting search
        await sourceCommon.ensureTokensAreUpdated(profile.id)

        const searchResults = await sourceCommon.search(source, '.tuna.json')
        if (!searchResults.length)
            return false
        
        // todo : harden json parse
        const lastIndexData = jsonHelper.parse( await sourceCommon.downloadJsonStatus(source.accessToken, searchResults[0]) )

        return source.indexImportDate > lastIndexData.date
    }
}