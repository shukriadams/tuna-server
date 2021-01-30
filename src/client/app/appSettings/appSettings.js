/**
 * App settings are set at the server, and will rarely change. Because they are defined server-side, and can be changed there, we
 * fetch them using update
 */
import ajax from './../ajax/asyncAjax'

class AppSettings{
    
    constructor (){
        this.windowTitle = 'Tuna'
        this.verbose = false
        this.serverUrl = window.location.origin
    }

    /**
     * Fetch must be called once at client start (see app.js). Currently there is no mechanism to update it after initial fetch, this can
     * be an issue if server settings change but the client instance persists.
     */
    async fetch(){
        const settings = await ajax.anonGet(`${this.serverUrl}/v1/settings`)

        if (!settings.errorCode)
            // /settings enpoint returns a hash table which should be applied to this object. 
            for (const prop in settings.payload)
                this[prop] = settings.payload[prop]
    }
}

window.Tuna = window.Tuna || {}
window.Tuna.settings = new AppSettings()

export default window.Tuna.settings