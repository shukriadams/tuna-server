import appSettings from './../appSettings/appSettings'
import Ajax from './../ajax/ajax'

export default {

    /**
     * fetches multiple content from server, requestedTypes is , comma-separated string
     **/
    fetch : async function(requestedTypes){
        return new Promise((resolve, reject)=>{
            try {
                const ajax = new Ajax()

                ajax.auth(`${appSettings.serverUrl}/v1/content/${requestedTypes}`, result => {
                    resolve(result.payload)
                }, result => {
                    // todo : handle error better
                    reject(result.message)
                })
            } catch(ex){
                reject(ex)
            }
        })

    }

}
