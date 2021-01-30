module.exports = {

    bind(app){

        /**
         * lightweight alive check
         */    
        app.get('/v1/system/isalive', async function (req, res) {
            __log.info(`ROUTE:/v1/system/isalive`)

            res.send('yeah, I\'m alive')
        })
    }
}