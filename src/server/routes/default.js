

module.exports = { 

    async bind(app) {

        let jsonHelper = require(_$+'helpers/json'),
            indexTemplate = null

        /**
         * This is a catch-all route that forces all page views to our single page app. This route must be bound last, 
         * or it will overwrite all other routes. This is also the only route in the app that doesn't return JSON
         */    
        app.get(/^[^.]+$/, async function (req, res) {
            __log.info(`ROUTE:/^[^.]+$/`)

            try {
                const Handlebars = require('handlebars'),
                    path = require('path'),
                    fs = require('fs'),
                    settings = require(_$+'helpers/settings'),
                    model = {
                        isJSBundled : settings.isJSBundled,
                        minModifier : settings.useMinifiedAssets ? '.min' : ''
                    }

                // load and parse template - this is the only server-side template logic. Use path relative to this file so the route works in unit tests too
                if (!indexTemplate){
                    const indexHbs = await fs.promises.readFile( path.join(__dirname, '..', 'templates', 'index.hbs') , 'utf8')
                    indexTemplate = Handlebars.compile(indexHbs)
                }

                res.send(indexTemplate(model))
                
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
    }
}

