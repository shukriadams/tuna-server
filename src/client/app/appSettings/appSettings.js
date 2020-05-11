import ajax from './../ajax/asyncAjax'

class AppSettings{

    
    constructor (){

        const isDev = window.location.host.indexOf('localhost') !== -1
        
        this.windowTitle = 'Tuna'

        if (isDev)
            this.serverUrl = 'http://localhost:3000'
        else 
            this.serverUrl = window.location.origin

        this.serverUrl = window.location.origin
        this.emailVerificationDeadlineHours = 12
    }


    async update(){
        const settings = await ajax.anon(`${this.serverUrl}/v1/settings`)

        if (!settings.code)
            for (let prop in settings.payload)
                this[prop] = settings.payload[prop]
    }
}

let settings = new AppSettings()

export default settings