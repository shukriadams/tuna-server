const 
    ImporterBase = require(_$+'helpers/importerBase'),
    constants = require(_$+'types/constants')

/**
 * Imports song data from nextcloud. This process consists of multiple steps. It exposes which step it's on, 
 * an optional % progress of that step (if progress can be measured), and a text message of some kind for the end user.
 * The process of importing is meant to be unattended, so the user cannot interact with it, and the user doesn't directly
 * see the outcome. Import result is written to a log, and the user can view the output of that log.
 */
class Importer extends ImporterBase {

    constructor(...args){
        super(...args)
        this.integrationName = constants.SOURCES_NEXTCLOUD
    }

    async _ensureTokens(){
        const nextCloudCommon = require(_$+'helpers/nextcloud/common')

        nextCloudCommon.ensureTokensAreUpdated(this.profileId)
    }
   
    
    /**
     * Searches for .tuna.dat files in user's nextcloud files and adds / updates their references in profile.sources object. This is the first 
     * step for importing music, the next step will be to read the contents of those index files.
     */
    async _updateIndexReferences(){
        const 
            settings = require(_$+'helpers/settings'),
            constants = require(_$+'types/constants'),
            Exception = require(_$+'types/exception'),
            xmlHelper = require(_$+'helpers/xml')

        let s = await this._getSource(),
            profile = s.profile, 
            source = s.source

        const 
            options = {
                method: settings.sandboxMode ? 'POST' : 'SEARCH',
                headers: {
                    'Content-Type': 'application/xml',
                    'Authorization' : `Bearer ${source.accessToken}`
                }
            },
            body = 
                `<?xml version="1.0" encoding="UTF-8"?>
                <d:searchrequest xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
                    <d:basicsearch>
                        <d:select>
                            <d:prop>
                                <oc:fileid/>
                            </d:prop>
                        </d:select>
                        <d:from>
                            <d:scope>
                                <d:href>/files/${source.userId}</d:href>
                                <d:depth>infinity</d:depth>
                            </d:scope>
                        </d:from>
                        <d:where>
                            <d:like>
                                <d:prop>
                                    <d:displayname/>
                                </d:prop>
                                <d:literal>.tuna.dat</d:literal>
                            </d:like>
                        </d:where>
                        <d:orderby/>
                    </d:basicsearch>
                </d:searchrequest>`

        const url = settings.sandboxMode ? `${this.settings.sandboxUrl}/v1/sandbox/nextcloud/find/.tuna.dat` : `${this.settings.nextCloudHost}/remote.php/dav`,
            result = await this.httputils.post(url, body, options)
        // todo : handle server call timing out

        // auth failure : This should not happen - we should have explicitly checked tokens just before this. Log explicit because
        // we will want to know if this is happening
        if(result.raw.statusCode === 401)
            throw new Exception({ 
                code : constants.ERROR_INVALID_SOURCE_INTEGRATION,
                forceLog : true,
                log: '401 despite explicit token testing',
                inner : {
                    body : result.body
                }
            })

        source.indexImportDate = new Date().getTime()
        source.status = constants.SOURCE_CONNECTION_STATUS_WORKING

        // if non-200 code returned, something is wrong, flag source connection as broken so user can reauthorize
        if (result.raw.statusCode < 200 || result.raw.statusCode > 299){
            source.indexes = [] // wipe existing
            source.status = constants.SOURCE_CONNECTION_STATUS_USER_REAUTHORIZE
            
            await this.profileLogic.update(profile)
            await this.log.create({ error : result.body }, `profile:${this.profileId}_nextcloud_indexupdate_fail`)
            return
        }

        const resultXml = await xmlHelper.toDoc(result.body)
            
        // no index files found
        if (!resultXml['d:multistatus']['d:response']){
            source.indexes = [] // wipe existing
            await this.profileLogic.update(profile)
            await this.log.create({ result: 'success, no index files found' }, `profile:${this.profileId}_nextcloud_indexupdate_success`)
            return
        }

        // write new index files, preserve existing ones so we keep their history properties
        let newIndices = []
        for (let i = 0 ; i < resultXml['d:multistatus']['d:response'].length; i ++){
            const response = resultXml['d:multistatus']['d:response'][i]
            
            let newIndex = {
                path : response['d:href'][0],
                id : response['d:propstat'][0]['d:prop'][0]['oc:fileid'][0],
                status :  ''
            }

            // if same index already exists, use that one again
            newIndex = source.indexes.find(index => index.path === newIndex.path && index.id === newIndex.id) || newIndex
            newIndices.push(newIndex)
        }

        source.indexes = newIndices
        await this.profileLogic.update(profile)
        await this.log.create({ result: `success, ${newIndices.length} index files found` }, `profile:${this.profileId}_nextcloud_indexupdate_success`)
    }


    /**
     * Reads data from remote index files, into temp local array
     */
    async _readIndices(){
        const 
            httputils = require('madscience-httputils'),
            urljoin = require('urljoin'),
            settings = require(_$+'helpers/settings'),
            logger = require('winston-wrapper').instance(settings.logPath),
            s = await this._getSource(),
            source = s.source

        if (!source.indexes.length)
            return
        
        const 
            index = source.indexes[0],
            url = this.settings.sandboxMode ? urljoin(this.settings.sandboxUrl, `/v1/sandbox/nextcloud/getfile/.tuna.dat`) : `${this.settings.nextCloudHost}${index.path}`,
            indexRaw = await httputils.downloadString ({ 
                url, 
                headers : {
                    'Authorization' : `Bearer ${source.accessToken}`
                }})

        const indexDoc = indexRaw.body.split('\n')
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

module.exports = Importer