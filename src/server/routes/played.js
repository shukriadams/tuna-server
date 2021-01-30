module.exports = {

    bind(app){

        const jsonHelper = require(_$+'helpers/json')

        /**
         * Registers a play as complete. 
         */
        app.post('/v1/played', async function (req, res) {
            __log.info(`ROUTE:/v1/played`)
            
            try {
                const authHelper = require(_$+'helpers/authentication'),
                    playMetricsHelper = require(_$+'helpers/playMetrics'),
                    authToken = await authHelper.authenticate(req),
                    result = await playMetricsHelper.played(
                        authToken.profileId, 
                        req.query.song, 
                        req.query.songDuration)

                jsonHelper.returnPayload(res, { result })

            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
        
    }
}