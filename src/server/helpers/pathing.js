let 
    expressPath,
    process = require('process')

module.exports = {

    /**
     * Gets the path of the express application, regardless of whether app is started from grunt
     * or from server.js in the express folder.
     */
    getExpressPath(){
        // if running from grunt, working directory is gruntfile's, force down into express folder
        if (!expressPath)
            expressPath = process.cwd()

        // let node go first, as it needs to override mocha
        if (process.env.JUSTPLAYITGRUNT || process.env.JUSTPLAYITMOCHA){
        } else if (process.env.COMPARINATORNODE) {
            expressPath = expressPath.replace(/\\/g, '/') // convert path to unix

            let parts = expressPath.split('/')
            parts.pop()
            expressPath = parts.join('/')
        }

        return expressPath
    }
}
