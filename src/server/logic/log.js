module.exports = {

    /**
     * entry : any STRING or OBJECT that should be logged.
     * context : some string key that can be used to retrieve log entries later. Not unique. Will typically be a combination of things like profileid + function + error type
     * profileId : optional, string profileid, useful if a logged event has user context
     */
    async create (content, context, profileId = null){

        // need to require here, if require in header pulls in self and recurses to death
        const 
            logType = require(_$+'types/log'),
            log = require(_$+'data/mongo/log'),
            record = Object.assign(
                logType.new(), 
                {
                    content,
                    date : new Date().getTime(),
                    profileId,
                    context,
                })

        await log.create(record)
    }
}