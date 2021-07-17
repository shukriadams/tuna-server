module.exports = {

    bind(app){

        const jsonHelper = require(_$+'lib/json')
        
        /** 
         * Logs a song as now playing
         */
        app.post('/v1/playing', async function(req, res){
            __log.info(`ROUTE:/v1/playing`)

            try {
                const authHelper = require(_$+'lib/authentication'),
                    playMetricsHelper = require(_$+'lib/playMetrics'),
                    authToken = await authHelper.authenticate(req)
                    
                await playMetricsHelper.playing(authToken.profileId, req.body.song)
                jsonHelper.returnPayload(res)

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
        
    }
}