const 
    Handlebars = require('handlebars'),
    path = require('path'),
    fs = require('fs-extra'),
    process = require('process'),
    settings = require(_$+'helpers/settings'),
    jsonHelper = require(_$+'helpers/json')

module.exports = { 
    async bind(app) {

        // load and parse template - this is the only server-side template logic
        const 
            indexHbs = await fs.promises.readFile( path.join(process.cwd(), 'server', 'templates', 'index.hbs') , 'utf8')
            indexTemplate = Handlebars.compile(indexHbs)
            
        /**
         * This is a catch-all route that forces all page views to our single page app. This route must be bound last, 
         * or it will overwrite all other routes. This is also the only route in the app that doesn't return JSON
         */    
        app.get(/^[^.]+$/, async function (req, res) {
            try {

                const model = {
                    isJSBundled : settings.isJSBundled,
                    minModifier : settings.useMinifiedAssets ? '.min' : ''
                }

                res.send(indexTemplate(model))
                
            } catch(ex){
                jsonHelper.returnException(res, ex)
            }
        })
    }
}

