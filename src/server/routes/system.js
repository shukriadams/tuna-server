module.exports = {

    bind(app){

        /**
         * lightweight alive check
         */    
        app.get('/v1/system/isalive', async function (req, res) {
            res.send('yeah, I\'m alive')
        })
    }
}