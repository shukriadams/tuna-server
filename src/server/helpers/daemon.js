let busy = false

module.exports = {
    
    start (){
        
        const CronJob = require('cron').CronJob,
            settings = require(_$+'helpers/settings')
    
        new CronJob(settings.daemonInterval, async ()=>{
            this.tick()
        }, 
        null, 
        true, 
        null, 
        null, 
        false /* runonitit */ )

    },

    async tick(){
        const settings = require(_$+'helpers/settings'),
            profileLogic = require(_$+'logic/profiles'),
            sourceProvider = require(_$+'sources/provider'),
            sourceCommon = require(_$+'sources/common')

        if (busy)
            return

        busy = true

        try {

            // do song re-import
            const profiles = await profileLogic.getAll()

            for (const profile of profiles){

                if (!profile.sources || !profile.sources[settings.musicSource])
                    continue

                if (await sourceCommon.isRemoteNewer(profile)){

                    const Importer = sourceProvider.getImporter(),
                        importer = new Importer(profile.id)

                    try {

                        // warning ! we're awaiting this, so profiles are processed in series. On multiuser systems
                        // this obviously doesn't scale, but don't want to slam the remote with all users simultaneously either
                        // find some form of staggered parallel call
                        await importer.start()

                        __log.info(`songs autoimported for user ${profile.identifier}`)

                    } catch (ex){

                        __log.error(ex)

                    }
                }

            }

        } catch (ex) {

            __log.error(ex)

        } finally {

            busy = false

        }
    }
}