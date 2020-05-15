/**
 * Stores mp3 blobs in local storage. this data is not stored in redux because it's unnecessary,
 * blobs are treated as external data,
 * This is a wrapper for Dexie, which in turn is a wrapper for IndexedDb
 */
import Dexie from 'dexie'
import debug from './../misc/debug'

export default class BlobStore {

    /**
     *
     **/
    constructor() {
        this._db = new Dexie('tuna');
        this._db.version(1).stores({
            records : 'key, data, created'
        });

    }


    /**
     * Converts local blob to a url - url can be sent to media player which will play the blob
     */
    _toUrl (data){
        // Get window.URL object
        const URL = window.URL || window.webkitURL

        // Create and revoke ObjectURL
        try {
            return URL.createObjectURL(data)
        } catch(ex){
            console.log(`createObjectURL failed, most likely because of invalid data blob`, data)
        }
    }


    /**
     *
     */
    printSize(){
        let size = 0

        this._db.records
            .each (function (record) {

                if (record.data.size)
                    size += record.data.size

                debug(size)
            })
    }


    /**
     *
     */
    add(key, data, callback) {
        this._db.records.put({
            key: key,
            data: data,
            created : new Date()
        })

        if (callback)
            callback( this._toUrl(data))
    }


    /**
     *
     */
    getOrDownload(song, key, url, callback){
        this.get(key, result => {
            if (result)
                callback( this._toUrl( result ) )
            else
                this.download(song, key, url, callback)
        })
    }


    /**
     * Downloads song from its streaming url. This can be on dropbox, or a local proxy for nextcloud. Local
     * proxy requires authentication.
     */
    download(song, key, url, callback) {
        // Create XHR
        let xhr = new XMLHttpRequest(),
            blob = null

        xhr.open('GET', url, true)
        xhr.responseType = 'blob'

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {

                blob = xhr.response

                this.add(key, blob, callback)
                debug(`song fetched and cached in indexeddb : ${url}`)

            }
        }, false)

        xhr.send()
    }


    /**
     * gets media url of song blob if present, else returns null.
     */
    async getLocalMediaUrl(key){
        return new Promise((resolve, reject) => {
            this._db.records
                .where('key').equalsIgnoreCase(key)
                .toArray()
                .then(records => {
                    let data = records.length === 0 ? null : records[0].data
                    resolve( data ? this._toUrl(data) : null)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }


    /**
     * replaced by getLocalMediaUrl, but that's async
     */
    get(key, callback){
        this._db.records
            .where('key').equalsIgnoreCase(key)
            .toArray()
            .then(records => {
                let data = records.length === 0 ? null : records[0].data
                callback(data)
            })
    }


    /**
     *
     */
    getKeys(callback){
        this._db.records
            .toArray()
            .then(records => {
                callback(records.map(function(record){ return record.key }))
            })
    }


    /**
     * Clears (flushes) all data
     */
    clear(callback){
        this._db.records
            .each (record => {
                this.remove(record.key)
                debug(`removed ${record.key}`)
            })

        this._db.records.
            clear()

        this._db.records
            .where('key').notEqual('')
            .toArray()
            .then(records => {
                debug(`existing records : ${records.length}`)
            })

        if (callback)
            callback()

    }

    async clearAsync(){
        return new Promise((resolve, reject)=>{
            try {
                this.clear(()=>{
                    resolve()
                })
            } catch(ex){
                reject(ex)
            }
        })
    }


    /**
     *
     */
    remove(key, callback){
        this._db.records
            .where('key').equalsIgnoreCase(key)
            .delete()
            .then(( )=>{
                if (callback)
                    callback()
            })
    }
}