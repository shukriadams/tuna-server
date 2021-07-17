const BaseDaemon = require(_$+'daemon/base')
    

/**
 * @extends {BaseDaemon}
 */
module.exports = class extends BaseDaemon {
    constructor(){
        const settings = require(_$+'lib/settings')
        super(settings.eventLogPurgeInterval)
    }

    async _work(){
        const eventLogLogic = require(_$+'logic/eventLog'),
            profileLogic = require(_$+'logic/profiles')

        // truncate event log
        const profiles = await profileLogic.getAll()

        for (const profile of profiles){
            try {
                await eventLogLogic.prune(profile.id)
            } catch (ex) {
                __log.error(ex)
            }
        }
    }
}