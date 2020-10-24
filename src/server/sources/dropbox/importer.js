const
    ImporterBase = require(_$+'sources/importerBase'),
    constants = require(_$+'types/constants')

/**
 * Imports song data from nextcloud. This process consists of multiple steps. It exposes which step it's on, 
 * an optional % progress of that step (if progress can be measured), and a text message of some kind for the end user.
 * The process of importing is meant to be unattended, so the user cannot interact with it, and the user doesn't directly
 * see the outcome. Import result is written to a log, and the user can view the output of that log.
 */
module.exports = class extends ImporterBase {

    constructor(...args){
        super(...args)
        this.integrationName = constants.SOURCES_DROPBOX
    }

    
    /**
     * Searches for .tuna.dat files in user's nextcloud files and adds / updates their references in profile.sources object. This is the first 
     * step for importing music, the next step will be to read the contents of those index files.
     */
    async _updateIndexReferences(){
        let common = require(_$+'sources/dropbox/helper'),
            constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            s = await this._getSource(),
            profile = s.profile, 
            source = s.source,
            newIndices = [],
            accessToken = source.accessToken
            
        if (!accessToken)
            return reject(new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION }))

        // even thought Tuna index file is prefixed with '.' we omit that as it seems to confuse dropbox's api
        let matches = await common.search(source, 'tuna.dat')

        if (matches.length){
            let path = matches[0],
                newIndex = {
                    path,
                    id : null,
                    status :  ''
                }

            // if same index already exists, use that one again
            newIndex = source.indexes.find(index => index.path === newIndex.path && index.id === newIndex.id) || newIndex
            newIndices.push(newIndex)
        }

        // write new index files, preserve existing ones so we keep their history properties
        source.indexes = newIndices
        source.indexHash = this.indexHash
        source.indexImportDate = new Date().getTime()

        await this.profileLogic.update(profile)
        await this.log.create({ result: `success, ${newIndices.length} index files found` }, `profile:${this.profileId}_nextcloud_indexupdate_success`)
    }


    /**
     * Reads data from remote index files, into temp local array
     */
    async _readIndices(){
        const
            common = require(_$+'sources/dropbox/helper'),
            constants = require(_$+'types/constants'),
            settings = require(_$+'helpers/settings'),
            logger = require('winston-wrapper').instance(settings.logPath),
            Exception = require(_$+'types/exception')

        let s = await this._getSource(),
            source = s.source

        if (!source.accessToken)
            throw new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION })

        if (!source.indexes.length)
            throw new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION, public : 'No index found - please run the Tuna indexer in your Dropbox folder' })

        // we're taking only the first index here, still no logic for handling multiple
        let indexData = await common.downloadAsString(source.accessToken, source.indexes[0].path) 
        const indexDoc = indexData.split('\n')
        
        this.indexHash = JSON.parse(indexDoc[0]).hash

        for (let i = 0 ; i < indexDoc.length - 1; i ++){
            const raw = indexDoc[i + 1]

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
