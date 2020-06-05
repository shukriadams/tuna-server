

module.exports = {
    async isRemoteNewer(profileId, sourceCommon){
        const
            profileLogic = require(_$+'logic/profiles'),
            settings = require(_$+'helpers/settings'),
            jsonHelper = require(_$+'helpers/json'),
            constants = require(_$+'types/constants'),
            profile = await profileLogic.getById(profileId)

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
        let indexData = await sourceCommon.downloadAsString(source.accessToken, searchResults[0])
        const lastIndexData = jsonHelper.parse( indexData  )

        return source.indexImportDate < lastIndexData.date
    }
}