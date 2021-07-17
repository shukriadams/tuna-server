module.exports = {
    async bindRoutes(express){
        let fs = require('fs-extra'),   // 77ms
            defaultRoute = null,
            routeFiles = await fs.promises.readdir(_$+'routes')

        for (let routeFile of routeFiles){

            const name = routeFile.match(/(.*).js/).pop()
                routes = require(_$+`routes/${name}`)

            if (name === 'default'){
                defaultRoute = routes
                continue
            }

            await routes.bind(express)
        }

        // finally, load default route. This must be bound last because its pattern works
        // as a catchall for anything that isn't caught by a more specific fixed pattern.
        if (defaultRoute)
            await defaultRoute.bind(express)
    }
}