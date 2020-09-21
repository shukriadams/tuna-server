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

    }

}

module.exports = Importer