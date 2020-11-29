
/**
 * Common logic for all sources
 */
module.exports = {

    /**
     * Downloads and parses .tuna.json from source, compares date in that vs last known import date.
     * Returns true if remote .tuna.json is newer. 
     * 
     * profile : profile object
     */
    async isRemoteNewer(profile){
        const
            settings = require(_$+'helpers/settings'),
            jsonHelper = require(_$+'helpers/json'),
            constants = require(_$+'types/constants'),
            sourceProvider = require(_$+'sources/provider'),
            source = sourceProvider.getSource()

        const sourceIntegration = profile.sources[settings.musicSource]
        if (!sourceIntegration)
            throw new Exception({
                code : constants.ERROR_INVALID_SOURCE_INTEGRATION
            })

        // must ensure tokens before attempting search
        await source.ensureIntegration(profile.id)
        
        // todo : harden json parse
        let indexData = await source.downloadAsString(sourceIntegration, '.tuna.json')
        const lastIndexData = jsonHelper.parse( indexData  )

        return sourceIntegration.indexImportDate < lastIndexData.date
    }
}