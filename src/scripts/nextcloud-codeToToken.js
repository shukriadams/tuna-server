(async ()=>{

    const 
        send = require('./sendCommand'),
        process = require('process'),
        minimist = require('minimist'),
        argv = minimist(process.argv.slice(2))

    if (!argv.code){
        console.error('--code required. Get this by initiating and oauth flow against your nextclod server and capturing the code in the browser when it redirects')
        process.exit(1)
    }
    
    try {
        let reply = await send('nextcloud-codeToToken', { code : argv.code })
        console.log(reply)
        process.exit(0)

    } catch(ex){
        console.log(ex)
    }

})()

