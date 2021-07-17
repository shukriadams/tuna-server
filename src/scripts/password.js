/**
 * Sets user password
 * use : node password --new <PASSWORD>
 * 
 */
 (async ()=>{

    const send = require('./sendCommand'),
        process = require('process'),
        minimist = require('minimist'),
        argv = minimist(process.argv.slice(2))

    if (!argv.new){
        console.error('--new <PASSWORD>')
        process.exit(1)
    }
    
    try {
        let reply = await send('password-change', { password : argv.new })
        console.log(reply)
        process.exit(0)
    } catch(ex){
        console.log(ex)
    }

})()

