/**
 * Developer version of Nextcloud importer - let's us import index data from local server/references/nextcloud folder, which simulates
 * a nextcloud source.
 */

let 
    path = require('path'),
    fs = require('fs-extra'),
    Exception = require(_$+'types/exception'),
    constants = require(_$+'types/constants'),
    Importer = require(_$+'helpers/nextcloud/importer'),
    xmlHelper = require(_$+'helpers/xml')

class ImporterSandbox extends Importer {

    async _updateIndexReferences(){
        let s = await this._getSource(),
            profile = s.profile, 
            source = s.source

        source.indexImportDate = new Date().getTime()
        source.status = constants.SOURCE_CONNECTION_STATUS_WORKING
        
        let foundIndices = [{ path : '/.tuna.xml', id : 123 }]
        let newIndices = []
        
        for (let i = 0 ; i < foundIndices.length; i ++){
            const response =  foundIndices[i]
            
            let newIndex = {
                path : response.path,
                id : response.id,
                readDate : null, 
                status :  ''
            }

            // if same index already exists, use that one again
            newIndex = source.indexes.find(index => index.path === newIndex.path && index.id === newIndex.id) || newIndex
            newIndices.push(newIndex)
        }

        source.indexes = newIndices
        await this.profileLogic.update(profile)
    }

    async _readIndices(){
        const s = await this._getSource(),
            source = s.source

        for (const index of source.indexes){
            // force indexes to load relative to this root
            const readPath = path.join('./server/reference/dropbox', index.path)

            if (!await fs.exists(readPath))
                // expose internal error to use - this a dev importer
                throw new Exception({ 
                    log: `expected sandbox index ${readPath} not found`,
                    public :  `expected sandbox index ${readPath} not found`
                })

            const indexFileData = await fs.readFile(readPath, 'utf8'),
                indexDoc = await xmlHelper.toDoc(indexFileData)

            for (let i = 0 ; i < indexDoc.items.item.count() ; i ++)
                this.songsFromIndices.push(indexDoc.items.item.at(i).attributes())
        }
    }
}

module.exports = ImporterSandbox