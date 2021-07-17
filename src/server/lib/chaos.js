module.exports = {
    async bind(){
        const settings = require(_$+`lib/settings`)
        if (!settings.enableChaos)
            return            

        const fs = require('fs-extra'),
            chaosfiles = await fs.promises.readdir(_$+'chaos')

        for (let chaosfile of chaosfiles){
            const name = chaosfile.match(/(.*).js/).pop(),
                chaos = require(_$+`chaos/${name}`)

            await chaos.bind()
            console.log(`bound chaos ${name}`)
        }
    }
}