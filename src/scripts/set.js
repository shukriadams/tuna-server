/**
 * Use this as external set command to change state on server.
 */
(async ()=>{

    const 
        send = require('./sendCommand'),
        process = require('process'),
        minimist = require('minimist'),
        argv = minimist(process.argv.slice(2))

    if (!argv.password){
        console.error('--password required')
        process.exit(1)
    }
    
    try {
        let reply = await send('password-change', { password : argv.password })
        console.log(reply)
        process.exit(0)
    } catch(ex){
        console.log(ex)
    }

})()

