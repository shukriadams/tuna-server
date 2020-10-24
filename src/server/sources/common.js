

module.exports = {

    /**
     * Downloads and parses .tuna.json from source, compares date in that vs last known import date.
     * Returns true if remote .tuna.json is newer. 
     */
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
        await sourceCommon.ensureIntegration(profile.id)
        
        // todo : harden json parse
        let indexData = await sourceCommon.downloadAsString(source.accessToken, '.tuna.json')
        const lastIndexData = jsonHelper.parse( indexData  )

        return source.indexImportDate < lastIndexData.date
    }
}