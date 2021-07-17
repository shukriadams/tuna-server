const BaseDaemon = require(_$+'daemon/base')

/**
 * @extends {BaseDaemon}
 */
module.exports = class extends BaseDaemon {
    
    constructor(){
        const settings = require(_$+'lib/settings')
        super(settings.importInterval)
    }

    async _work(){
        const settings = require(_$+'lib/settings'),
            profileLogic = require(_$+'logic/profiles'),
            sourceProvider = require(_$+'sources/provider'),
            eventLogLogic = require(_$+'logic/eventLog'),
            sourceCommon = require(_$+'sources/common')

        // do song re-import
        const profiles = await profileLogic.getAll()
        for (const profile of profiles){
            try {

                if (!profile.sources || !profile.sources[settings.musicSource])
                    continue

                if (await sourceCommon.isRemoteNewer(profile)){

                    const Importer = sourceProvider.getImporter(),
                        importer = new Importer(profile.id)

                    // warning ! we're awaiting this, so profiles are processed in series. On multiuser systems
                    // this obviously doesn't scale, but don't want to slam the remote with all users simultaneously either
                    // find some form of staggered parallel call
                    await importer.start()

                    __log.info(`songs autoimported for user ${profile.identifier}`)
                }

            } catch(ex) {
                __log.error(ex)
                await eventLogLogic.create(profile.id, ex.code || 'not available', `auto_import_${settings.musicSource}`, JSON.stringify(ex))
            }
        }
    }
}