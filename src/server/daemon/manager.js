module.exports = {
    
    daemons : [],

    async startAll(){

        const fs = require('fs-extra'),
            daemonFiles = await fs.promises.readdir(_$+'daemon/daemons')

        for (const daemonFile of daemonFiles){
            const name = daemonFile.match(/(.*).js/).pop(),
                Daemon = require(_$+`daemon/daemons/${name}`),
                daemon = new Daemon()

            this.daemons.push(daemon)
            daemon.start()
        }
    }
}