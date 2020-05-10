const
    Dropbox = require('dropbox'),
    ImporterBase = require(_$+'helpers/importerBase'),
    common = require(_$+'helpers/dropbox/common'),
    constants = require(_$+'types/constants'),
    Exception = require(_$+'types/exception'),
    xmlHelper = require(_$+'helpers/xml')

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

    async _ensureTokens(){
        // dropbox doesn't need this
    }
    

    async _readFile(accessToken, path){
        return new Promise((resolve, reject)=>{
            try {
                const dropbox = new Dropbox({ accessToken })

                dropbox.filesDownload({ path }).then(function(data){
                    let decoded = new Buffer(data.fileBinary, 'binary').toString('utf8')
                    resolve(decoded)
                }, function(err){
                    reject(err)
                })
            } catch(ex){
                reject(ex)
            }
        })

    }

    /**
     * Searches for .tuna.xml files in user's nextcloud files and adds / updates their references in profile.sources object. This is the first 
     * step for importing music, the next step will be to read the contents of those index files.
     */
    async _updateIndexReferences(){
        let s = await this._getSource(),
            profile = s.profile, 
            source = s.source,
            newIndices = [],
            accessToken = source.accessToken
            
        if (!accessToken)
            return reject(new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION }))

        // even thought Tuna index file is prefixed with '.' we omit that as it seems to confuse dropbox's api
        let matches = await common.search(source, 'tuna.xml')

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
        let s = await this._getSource(),
            source = s.source

        if (!source.accessToken)
            throw new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION })

        if (!source.indexes.length)
            throw new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION, public : 'No index found - please run the Tuna indexer in your Dropbox folder' })

        // we're taking only the first index here, still no logic for handling multiple
        let indexData = await this._readFile(source.accessToken, source.indexes[0].path)
        const indexDoc = await xmlHelper.toDoc(indexData)
        
        this.indexHash = indexDoc.items.attributes().hash

        for (let i = 0 ; i < indexDoc.items.item.count() ; i ++)
            this.songsFromIndices.push(indexDoc.items.item.at(i).attributes())

    }

}
