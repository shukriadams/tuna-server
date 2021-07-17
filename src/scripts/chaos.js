/**
 * Overrides a module by absolute path. See the /src/chaos folder
 * use : node chaos --path <PATH>
 * 
 */
 (async ()=>{

    const send = require('./sendCommand'),
        process = require('process'),
        minimist = require('minimist'),
        argv = minimist(process.argv.slice(2))

    if (argv.path){
        try {
            let reply = await send('chaos', { path : argv.path })
            console.log(reply)
            process.exit(0)
        } catch(ex){
            console.log(ex)
        }

        return
    }
    
    if (argv.reset){
        try {
            let reply = await send('chaos', { reset : true })
            console.log(reply)
            process.exit(0)
        } catch(ex){
            console.log(ex)
        }
        
        return
    }

    console.log('Unsupported sub-command')

})()

