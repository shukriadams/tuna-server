const 
    ImporterBase = require(_$+'helpers/importerBase'),
    constants = require(_$+'types/constants')

/**
 * Imports song data from s3. 
 */
class Importer extends ImporterBase {

    constructor(...args){
        super(...args)
        this.integrationName = constants.SOURCES_S3
    }
   
    
    /**
     * Not used for s3
     */
    async _updateIndexReferences(){
        
    }

    /**
     * Reads data from remote index files, into temp local array
     */
    async _readIndices(){
        let s3utils = require('madscience-s3helper').utils,
            index,
            settings = require(_$+'helpers/settings'),
            logger = require('winston-wrapper').instance(settings.logPath)
            
        try {
            index = await s3utils.getStringFile({ accessKeyId : settings.s3key, secretAccessKey : settings.s3secret, endpoint : settings.s3host }, settings.s3bucket, '.tuna.dat')
        }catch (ex){
            logger.error.error(`Failed to retrieve index data from S3\nError : ${ex}`)
            return
        }
        
        const indexDoc = index.includes('\r\n') ?  index.split('\r\n') :  index.split('\n')
        this.indexHash = JSON.parse(indexDoc[0]).hash
        
        for (let i = 0 ; i < indexDoc.length - 1; i ++){
            const raw = indexDoc[i + 1]

            // skip empty items
            if (!raw)
                continue

            try {
                this.songsFromIndices.push(JSON.parse(raw))
            } catch (ex){
                logger.error.error(`JSON parse error for imported song data. \nJSON : ${raw}\nError : ${ex}`)
            }
        }


    }

}

module.exports = Importer