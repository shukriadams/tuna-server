/**
 * Used to allow command line scripts to send commands to server. See /src/tools folder.
 */

module.exports = {

    initialize () {
        
        const ipc = require('node-ipc')
        ipc.config.id = 'tunaserver'
        ipc.config.retry = 15
        ipc.config.silent = true

        ipc.serve(() => {
            ipc.server.on(
                'message',
                this.onMessage.bind(this)
            )
        })
     
        ipc.server.start()
        this.ipc = ipc
    },
    
    async nextcloudCodeToToken (args){
        const profileLogic = require(_$+'logic/profiles'),
            nextcloudCommon = require(_$+'sources/nextcloud/helper'),
            settings = require(_$+'lib/settings')

        if (settings.sandboxMode)
            return 'FAILED - code swapping cannot be done in sandbox mode.'

        const profile = await profileLogic.getByIdentifier(settings.masterUsername)
        await nextcloudCommon.swapCodeForToken(profile.id, args.code)
        return 'SUCCESS - the code has been swapped for a token. Tuna will keep this token updated'
    },

    async changePassword(args) {
        const profileLogic = require(_$+'logic/profiles'),
            settings = require(_$+'lib/settings'),
            profile = await profileLogic.getByIdentifier(settings.masterUsername)

        profile.password = args.password
        await profileLogic.update(profile)
        return 'Password updated'
    },

    async chaos(args){
        const overrideRequire = require(_$+'lib/require'),
            clonedeep = require('lodash.clonedeep')

        if (args.reset)
            return overrideRequire.clear()
        
        if (args.path){
            let originalPath = `${_$}${args.path}`
                mod = null,
                original = null

            try {
                mod = require(`./../chaos/${args.path}`)
                original = require(originalPath)

            } catch(ex){
                console.log(`Could not load chaos module ${args.path} : `,ex)
                return
            }

            // copy original by cloning it so we don't contaminate original
            original = clonedeep(original)

            // merge chaos into original
            mod = Object.assign(original, mod)

            overrideRequire.add(originalPath, mod)
            return `loaded chaos override ${args.path} - hope you know what you're doing`
        }
    },

    async onMessage(message, socket){
        let pass = false,
            reply = '',
            processor = null

        if (message.name === 'password-change')
            processor = this.changePassword

        if (message.name === 'nextcloud-codeToToken')
            processor = this.nextcloudCodeToToken

        if (message.name === 'chaos')
            processor = this.chaos

        if (!processor)
            return this.ipc.server.emit(
                socket,
                `${message.name}-reply`,  
                { reply : `${message.name} is not a supported command`, pass : false }
            )

        try {
            reply = await processor(message)
            pass = true
        } catch(ex){
            reply = ex
        }

        this.ipc.server.emit(
            socket,
            `${message.name}-reply`,  
            { reply, pass }
        )
    }

}