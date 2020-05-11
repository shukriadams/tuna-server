/**
 * Forces data fetch from server.
 **/
import appSettings from './../appSettings/appSettings'
import Ajax from './../ajax/ajax'

export default {
    async fetch (){
        return new Promise((resolve, reject)=>{
            new Ajax().auth(`${appSettings.serverUrl}/v1/session`, 
                result => {
                    if (result.code)
                        return reject(result)

                    resolve (result.payload)
                }, 
                error => {
                    reject(error)
                })
        })
    }
}