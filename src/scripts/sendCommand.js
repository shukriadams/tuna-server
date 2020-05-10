const ipc = require('node-ipc')
 
module.exports = async function(name, data){
    return new Promise((resolve, reject)=>{
        try {
            
            ipc.config.id = name
            data.name = name

            ipc.connectTo(
                'tunaserver',
                ()=>{
            
                    // send message to server
                    ipc.of.tunaserver.on('connect',()=>{
                        ipc.of.tunaserver.emit(
                            'message', 
                            data
                        )
                    })
            
                    // wait for reply to message
                    ipc.of.tunaserver.on(
                        `${name}-reply`, 
                        (reply)=>{
                            resolve(reply)
                        }
                    )
                }
            )
        } catch(ex) {
            reject(ex)
        }
    })
}
