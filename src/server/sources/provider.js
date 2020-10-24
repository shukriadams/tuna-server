module.exports = {

    validateSettings (){
        const 
            settings = require(_$+'helpers/settings'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants')

        if (settings.musicSource !== constants.SOURCES_DROPBOX && 
            settings.musicSource !== constants.SOURCES_S3 &&
            settings.musicSource !== constants.SOURCES_NEXTCLOUD)
                throw new Exception({ log: `Invalid setup - ${settings.musicSource} is not a valid music source` })
    },

    getImporter (){
        const 
            settings = require(_$+'helpers/settings'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants')
        
        if(settings.musicSource === constants.SOURCES_DROPBOX)
            return require(_$+'sources/dropbox/importer')

        if(settings.musicSource === constants.SOURCES_NEXTCLOUD)
            return require(_$+'sources/nextcloud/importer')

        if(settings.musicSource === constants.SOURCES_S3)
            return require(_$+'sources/s3/importer')

        throw new Exception({ log: `Invalid setup - source ${settings.musicSource} could not be matched to an importer` })
    },

    getSource (){
        const 
            settings = require(_$+'helpers/settings'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants')
                
        if(settings.musicSource === constants.SOURCES_DROPBOX)
            return require(_$+'sources/dropbox/common')

        if(settings.musicSource === constants.SOURCES_NEXTCLOUD)
            return require(_$+'sources/nextcloud/common')

        if(settings.musicSource === constants.SOURCES_S3)
            return require(_$+'sources/s3/common')

        throw new Exception({ log: `Invalid setup - source ${settings.musicSource} could not be matched to a helper` })
    }
}