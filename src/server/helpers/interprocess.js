/**
 * Used to allow command line scripts to send commands to server. See /src/tools folder.
 */
module.exports = {

    initialize : () => {

        const 
            ipc = require('node-ipc'),
            profileLogic = require(_$+'logic/profiles'),
            settings = require(_$+'helpers/settings')
            nextcloudCommon = require(_$+'helpers/nextcloud/common'),
            changePassword = async (args) => {
                const profile = await profileLogic.getByIdentifier(settings.masterUsername)
                profile.password = args.password
                await profileLogic.update(profile)
                return 'Password updated'
            },
            nextcloudCodeToToken = async(args)=>{
                if (settings.musicSourceSandboxMode)
                    return 'FAILED - code swapping cannot be done in sandbox mode.'

                const profile = await profileLogic.getByIdentifier(settings.masterUsername)
                await nextcloudCommon.swapCodeForToken(profile.id, args.code)
                return 'SUCCESS - the code has been swapped for a token. Tuna will keep this token updated'
            }

        ipc.config.id = 'tunaserver'
        ipc.config.retry = 15
        ipc.config.silent = true

        ipc.serve(() => {
            ipc.server.on(
                'message',
                async (message, socket) =>{
                    
                    let pass = false,
                        reply = ''

                    let processor = null
                    if (message.name === 'password-change')
                        processor = changePassword
                    else if (message.name === 'nextcloud-codeToToken')
                        processor = nextcloudCodeToToken
                    
                    try {
                        reply = await processor(message)
                        pass = true
                    } catch(ex){
                        reply = ex
                    }

                    ipc.server.emit(
                        socket,
                        `${message.name}-reply`,  
                        { reply, pass }
                    )
                }
            )
        })
     
        ipc.server.start()
    },


}