const 
    constants = require(_$+'types/constants'),
    Exception = require(_$+'types/exception'),
    Song = require(_$+'types/song'),
    songsLogic = require(_$+'logic/songs'),
    playlistLogic = require(_$+'logic/playlists'),    
    debounce = require(_$+'helpers/debounce')

/**
 * Imports song data from source platform like nextcloud, dropbox etc. This process consists of multiple steps. It exposes which step it's on, 
 * an optional % progress of that step (if progress can be measured), and a text message of some kind for the end user.
 * The process of importing is meant to be unattended, so the user cannot interact with it, and the user doesn't directly
 * see the outcome. Import result is written to a log, and the user can view the output of that log.
 */
class Importer {

    /**
     * authTokenId can be null
     */
    constructor(profileId, authTokenId){
        const settings = require(_$+'helpers/settings')

        // MUST be set by overriding class, egs, constants.SOURCES_NEXTCLOUD
        this.socketHelper = require(_$+'helpers/socket')
        this.httputils = require('madscience-httputils')
        this.log = require(_$+'logic/log')
        this.cache = require(_$+'helpers/cache')
        this.settings = require(_$+'helpers/settings')
        this.profileLogic = require(_$+'logic/profiles')

        this.logger = require('winston-wrapper').instance(settings.logPath)
        this.profileId = profileId
        this.authTokenId = authTokenId
        this.integrationName = null
        
        // lets user get status of import job will it's running
        this.cacheKey = `${profileId}_importProgress`
        // populated with data from xml index files
        this.queuedSongs = []
        // keys of songs to import - used to remove orphans
        this.songKeysToImport = []
        // hash (string)
        this.indexHash
        // counter to enumerate through this.queuedSongs      
        this.completedSongsCount = 0
        // array of songs user already has in db
        this.existingSongs = [] // need??
        this.insertQueue = []
        this.updateQueue = []
        // callback when importing is complete
        this._onDone = null
    }

    
    /**
     * returns true if an existing import for this user is in progress
     */
    async inProgress(){
        return !!(await this.cache.get( this.cacheKey ))
    }


    /**
     * starts the import process. check inProgress()
     */
    async start(){

        if (await this.inProgress())
            throw new Exception({ code : constants.ERROR_IMPORT_IN_PROGRESS })

        try {
            // write flag to cache so we can prevent user from doing overlapping imports
            await this.cache.add( this.cacheKey, { date : new Date().getTime() })

            // ensure integration + tokens before proceeeding
            const provider = require(_$+'sources/common'),
                source = provider.getSource()

            source.ensureIntegration(this.profileId)

            await this._updateIndexReferences()
            await this._readIndices()

            this.existingSongs = await songsLogic.getAll(this.profileId)
            this._processNextSong.call(this)

        } catch(ex) {
            await this.cache.remove( this.cacheKey )
            throw ex
        }
    }

    
    /**
     * Searches for .tuna.dat files in user's source platform files and adds / updates their references in profile.sources object. This is the first 
     * step for importing music, the next step will be to read the contents of those index files.
     */
    async _updateIndexReferences(){
        throw 'Not implemented'
    }


    /**
     * Reads data from remote index files, into temp local array
     */
    async _readIndices(){
        throw 'Not implemented'
    }
    

    /**
     * Processes file in this.songsFromIndexes @ index this.completedSongsCount. 
     * 
     * This method can be called to start processing songs, it will call itself after each song, then call this._finish when
     * there are no more songs to process.
     */
    _processNextSong(){
        /* importing a lot of files can hoze a CPU, wrap in setImmediate to ensure machine remains responsive */
        setImmediate(async ()=>{
            try {
    
                if (this.completedSongsCount >= this.queuedSongs.length)
                    return await this._finish()

                let path = require('path'),
                    item = this.queuedSongs[this.completedSongsCount],
                    itemPath = item.path || null,
                    extension = path.extname(itemPath).replace('.', ''),
                    name = (item.name || '').trim(),
                    album = (item.album || '').trim(),
                    artist = (item.artist || '').trim(),
                    tags = (item.genres || '').split(',').filter(r => !!r.length),
                    duration = parseInt(item.duration) || 0,
                    fileSize = Math.floor(parseInt(item.size) || 0)
    
                this.completedSongsCount ++
    
                // if songs missing required values, skip
                if (!itemPath || !name || !album || !artist)
                    // todo : log warning out to user
                    return this._processNextSong.call(this)
    
                this.songKeysToImport.push(`${name}:${album}:${artist}`)
    
                let now = new Date().getTime(),
                    file = this.existingSongs.find(song => song.path === itemPath)
                
                // file doesn't exist, treat as new
                if (!file){
                    file = Song.new()
                    file.imported = now
                    file.name = name
                    file.album = album
                    file.artist = artist
                    this.insertQueue.push(file)
                }
    
                const fileChanged = 
                    file.extension !== extension ||
                    file.size !== fileSize ||
                    file.path !== itemPath ||
                    !this.areArraysIdentical(file.tags, tags) ||
                    file.duration !== duration
    
                // if file exists and has changed, add to update list
                if (file.imported !== now && fileChanged){
                    file.updated = now
                    this.updateQueue.push(file)
                }

                file.profileId = this.profileId
                file.extension = extension
                file.size = fileSize
                file.path = itemPath
                file.duration = duration
                file.plays = file.plays || 0
                file.tags = tags

                // update progress every nth second
                if (this.authTokenId)
                    debounce(`import.progress.${this.profileId}`, this.settings.debounceInterval, async () => {
                        this.socketHelper.send(this.authTokenId, 'import.progress', {
                            percent : Math.floor((this.completedSongsCount / this.queuedSongs.length) * 100),
                            text : `Importing '${name}' by ${artist}`
                        })
                    })
                
                await this.onSongProcessed({ file })

                this._processNextSong.call(this)
    
            } catch(ex){
                // clean out cached session, this should be last step and frees up the cache queue for this user
                await this.cache.remove( this.cacheKey )

                this.logger.error.error(ex)

                if (this.authTokenId)
                    this.socketHelper.send(this.authTokenId, 'import.progress', {
                        error : true,
                        text : 'Import failed - you should check the error logs.'
                    })
            }
        })
    }


    /**
     * Called at the end of the process of each song. Use this to extend process logic in derived classes.
     */
    async onSongProcessed(args){ 

    }

    onDone(callback){
        this._onDone = callback
    }

    areArraysIdentical(array1, array2){
        if (array1.length !== array2.length)
            return false
    
        if (!array1 && array2 || array1 && !array2)
            return false
    
        for (var i = 0 ; i < array1.length ; i ++){
            var item1 = array1[i]
            var item2 = array2[i]
    
            if (item1 && !item2 || !item1 && item2)
                return false
    
            for (var property in item1){
                if (!item1.hasOwnProperty(property) || !item2.hasOwnProperty(property))
                    continue
    
                if (item1[property] !== item2[property])
                    return false
            }
    
        }
    
        return true
    }

    /**
     * Called after the last song in this.queuedSongs is processed. Writes in-memory data to database,
     * cleans out orphan songs etc.
     */
    async _finish(){
        try{

            if (this.authTokenId)
                this.socketHelper.send(this.authTokenId, 'import.progress', {
                    text : 'Writing data, this might take a while...'
                })
            
            // insert new songs
            const total = this.insertQueue.length
            while (this.insertQueue.length){
                // insert a block of songs at a time
                await songsLogic.createMany(this.insertQueue.splice(0, this.settings.importInsertBlockSize))

                if (this.authTokenId)
                    debounce(`import.progress.${this.profileId}`, this.settings.debounceInterval, async () => {
                        this.socketHelper.send(this.authTokenId, 'import.progress', { 
                            text : `Saving new songs`,
                            percent : Math.floor(((total - this.insertQueue.length)/total) * 100)
                        })
                    })
            }
    
            // update existing songs - this is much slower than inserting as it writes one song at a time
            for (let i = 0 ; i < this.updateQueue.length ; i ++){
                const song = this.updateQueue[i]
                await songsLogic.update(song)
                
                if (this.authTokenId)
                    debounce(`import.progress.${this.profileId}`, this.settings.debounceInterval, async () => {
                        this.socketHelper.send(this.authTokenId, 'import.progress', {
                            text : `Updating existing songs`,
                            percent : Math.floor((i / this.updateQueue.length) * 100)
                        })
                    })
            }
        
            // remove orphaned songs
            let allSongs = await songsLogic.getAll(this.profileId),
                songsToDelete = []

            for (const song of allSongs){
                const songKey = `${song.name}:${song.album}:${song.artist}`
                if (!this.songKeysToImport.find(nameKey => nameKey === songKey))
                    songsToDelete.push(song)
            }

            for (let i = 0 ; i < songsToDelete.length ; i ++){
                const song = songsToDelete[i]
                await songsLogic.delete(song)
    
                if (this.authTokenId)
                    debounce(`import.progress.${this.profileId}`, this.settings.debounceInterval, async () => {
                        this.socketHelper.send(this.authTokenId, 'import.progress', {
                            text : `Cleaning out old songs`,
                            percent : Math.floor((i / songsToDelete.length) * 100)
                        })
                    })
            }
        
            // remove orphaned songs from playlists
            if (songsToDelete.length) {
                let playlists = await playlistLogic.getAll(this.profileId)
        
                for (let playlist of playlists){
                    let changed = false
        
                    for (let i = 0 ; i < playlist.songs.length; i ++){
                        const playlistSongId = playlist.songs[i]
        
                        if (songsToDelete.find( existingSong => existingSong.id === playlistSongId )) {
                            // remove song from playlist
                            playlist.songs.splice(i, 1)
                            changed = true
                        }
                    }
        
                    if (changed)
                        await playlistLogic.update(playlist)
                }
            }
            
            // update indexes
            let s = await this._getSource(),
                profile = s.profile, 
                source = s.source,
                now = new Date()
           

            source.indexImportDate = now.getTime()
            source.indexHash = this.indexHash

            await this.profileLogic.update(profile)
            
            // signal that import is complete
            const authTokenLogic = require(_$+'logic/authToken'),
                allTokens = await authTokenLogic.getForProfile(this.profileId)

            for (let authToken of allTokens)
                this.socketHelper.send(authToken.id, 'import.progress', {
                    complete : true
                })
            
            if (this._onDone)
                await this._onDone()

        } finally {
            // clean out cached session, this should be last step and frees up the cache queue for this user
            await this.cache.remove( this.cacheKey )
        }
    }


    /**
     * Shared function, gets profile and source, ensures profile exists and that is has an applicable source.
     */
    async _getSource (){
        let profile = await this.profileLogic.getById(this.profileId)
        if (!this.integrationName)
            throw new Exception({ code : constants.ERROR_INVALID_ARGUMENT, log : 'integrationName not set' })

        if(!profile)
            throw new Exception({ code : constants.ERROR_INVALID_USER_OR_SESSION })

        let source = profile.sources[this.integrationName]
        if (!source)
            throw new Exception({ code : constants.ERROR_INVALID_SOURCE_INTEGRATION })

        // return tuple-like value
        return {
            profile, source
        }
    }

}

module.exports = Importer