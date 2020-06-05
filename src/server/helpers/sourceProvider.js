module.exports = {
    validate (){
        const 
            settings = require(_$+'helpers/settings'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants')

        if (settings.musicSource !== constants.SOURCES_DROPBOX && 
            settings.musicSource !== constants.SOURCES_NEXTCLOUD)
                throw new Exception({ log: 'Invalid setup - no music source defined' })
    },

    getImporter (){
        const 
            settings = require(_$+'helpers/settings'),
            Exception = require(_$+'types/exception'),
            dropboxImporter = require(_$+'helpers/dropbox/importer'),
            nextcloudImporter = require(_$+'helpers/nextcloud/importer'),
            constants = require(_$+'types/constants')
        
        if(settings.musicSource === constants.SOURCES_DROPBOX)
            return dropboxImporter

        if(settings.musicSource === constants.SOURCES_NEXTCLOUD)
            return nextcloudImporter

        throw new Exception({ log: `Invalid setup - source ${settings.musicSource} could not be matched to an importer` })
    },

    get (){
        const 
            settings = require(_$+'helpers/settings'),
            Exception = require(_$+'types/exception'),
            dropbox = require(_$+'helpers/dropbox/common'),
            nextcloud = require(_$+'helpers/nextcloud/common'),
            constants = require(_$+'types/constants')
                
        if(settings.musicSource === constants.SOURCES_DROPBOX)
            return dropbox

        if(settings.musicSource === constants.SOURCES_NEXTCLOUD)
            return nextcloud

        throw new Exception({ log: `Invalid setup - source ${settings.musicSource} could not be matched to a helper` })
    }
}