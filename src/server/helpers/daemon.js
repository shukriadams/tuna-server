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
            logger = require('winston-wrapper').instance(settings.logPath),
            sourceProvider = require(_$+'sources/provider'),
            sourceCommon = require(_$+'helpers/sourceCommon')

        if (busy)
            return

        busy = true

        try {

            // do song re-import
            const profiles = await profileLogic.getAll()

            for (const profile of profiles){

                if (!profile.sources || !profile.sources[settings.musicSource])
                    continue

                const source = sourceProvider.getSource()

                if (await sourceCommon.isRemoteNewer(profile.id, source)){

                    const Importer = sourceProvider.getImporter(),
                        importer = new Importer(profile.id)

                    try {

                        // warning ! we're awaiting this, so profiles are processed in series. On multiuser systems
                        // this obviously doesn't scale, but don't want to slam the remote with all users simultaneously either
                        // find some form of staggered parallel call
                        await importer.start()

                        logger.info.info(`songs autoimported for user ${profile.identifier}`)

                    } catch (ex){

                        logger.error.error(ex)

                    }
                }

            }

        } catch (ex) {

            logger.error.error(ex)

        } finally {

            busy = false

        }
    }
}