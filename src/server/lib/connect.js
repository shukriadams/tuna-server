module.exports = class {

    constructor(retries){
        const settings = require(_$+'types/settings')

        this._retries = retries === undefined ? settings.retriesOnConnectError : retries
    }

    async onError(ex){
        return true
    }

    async onResult(result){
        return true
    }

    async onFailed(){

    }

    async get(url){
        try {

        } catch(ex){
            this.onUnexpectedError(ex)
        }
    }

    async post(...args){
        let settings = require(_$+'types/settings'),
            httputils = require('madscience-httputils'),
            timebelt = require('timebelt'),
            attempts = 0

        while(attempts < this._retries){
            try {
                const result = await httputils.post(...args),
                    passed = await this.onResult(result)
                    
                if (passed)
                    return result

            } catch(ex){
                this.onError(ex)
            } finally {
                attempts ++
            }

            await timebelt.pause(settings.retryOnErrorWait)
        }

        await this.onFailed()
    }
}