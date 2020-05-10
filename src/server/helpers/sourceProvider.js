const 
    settings = require(_$+'helpers/settings'),
    Exception = require(_$+'types/exception'),
    dropbox = require(_$+'helpers/dropbox/common'),
    nextcloud = require(_$+'helpers/nextcloud/common'),
    dropboxImporter = require(_$+'helpers/dropbox/importer'),
    nextcloudImporter = require(_$+'helpers/nextcloud/importer'),
    nextcloudSandboxImporter = require(_$+'helpers/nextcloud/importerSandbox'),
    constants = require(_$+'types/constants')

module.exports = {
    validate (){
        if (settings.musicSource !== constants.SOURCES_DROPBOX && 
            settings.musicSource !== constants.SOURCES_NEXTCLOUD)
                throw new Exception({ log: 'Invalid setup - no music source defined' })
    },

    getImporter (){
        if(settings.musicSource === constants.SOURCES_DROPBOX)
            return dropboxImporter

        if(settings.musicSource === constants.SOURCES_NEXTCLOUD){
            if (settings.musicSourceSandboxMode)
                return nextcloudSandboxImporter
            else
                return nextcloudImporter
        }

        throw new Exception({ log: `Invalid setup - source ${settings.musicSource} could not be matched to an importer` })
    },

    get (){
        
        if(settings.musicSource === constants.SOURCES_DROPBOX)
            return dropbox

        if(settings.musicSource === constants.SOURCES_NEXTCLOUD)
            return nextcloud

        throw new Exception({ log: `Invalid setup - source ${settings.musicSource} could not be matched to a helper` })
    }
}