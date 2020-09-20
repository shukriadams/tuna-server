module.exports = {
    
    /**
     * Autogenerates the single master user
     */
    async autoCreateMaster(){

        let 
            settings = require(_$+'helpers/settings'),
            logger = require('winston-wrapper').instance(settings.logPath),
            dataCache = require(_$+'cache/profile'),
            Profile = require(_$+'types/profile')

        if (!settings.masterUsername)
            throw `"masterUsername" not defined in system settings`

        let profile = await this.getByIdentifier(settings.masterUsername)
        if (profile)
            return

        if (!settings.masterDefaultPassword)
            throw `"masterDefaultPassword" not defined in system settings`

        profile = Profile.new()
        profile.identifier = settings.masterUsername
        profile.password = settings.masterDefaultPassword
        profile.created = new Date().getTime()
        profile.isPasswordChangeForced = true
        profile.stateHash = profile.created.toString()

        this._processPassword(profile)

        profile = await dataCache.create(profile)
        
        logger.info.info('master user generated')

        return profile
    },

    
    async getAll(){
        const dataCache = require(_$+'cache/profile')
        return await dataCache.getAll()
    },


    /**
     * 
     */
    async getByIdentifier(identifier){
        const dataCache = require(_$+'cache/profile')
        return await dataCache.getByIdentifier(identifier)
    },


    /**
     * Writes an object's propeties onto an existing profile 
     */
    async updateProperties(properties){
        const settings = require(_$+'helpers/settings')

        if (!properties.id)
            throw 'properties must have an id'

        const profile = await this.getById(properties.id)

        if (settings.demoMode)
            return profile

        for (let property in profile)
            // copy over only properties that already exist in the recipient object
            if (properties[property])
                profile[property] = properties[property]

        return this.update(profile)  
    },


    /**
     *
     */
    async update(profile){
        const 
            dataCache = require(_$+'cache/profile'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants')       

        if (!profile)
            throw new Exception({ 
                code : constants.ERROR_VALIDATION, 
                public : 'profile required' 
            })

        this._processPassword(profile)
        
        profile.stateHash = new Date().getTime().toString()

        await dataCache.update(profile)
    },


    /**
     * Completely deletes a user.
     */
    async delete(profile){
        const dataCache = require(_$+'cache/profile'),
            songsLogic = require(_$+'logic/songs'),
            authTokenLogic = require(_$+'logic/authToken')

        await authTokenLogic.deleteForProfile(profile.id)

        await songsLogic.deleteForProfile(profile.id)

        await dataCache.delete(profile)
    },


    /**
     *
     */
    async getById(profileId){
        const dataCache = require(_$+'cache/profile')
        return await dataCache.getById(profileId)
    },


    /**
     *
     */
    async requestPasswordReset(identifier, email){
        const 
            randomstring = require('randomstring'),
            settings = require(_$+'helpers/settings'),
            dataCache = require(_$+'cache/profile'),
            sendgrid = require(_$+'helpers/sendgrid'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants')
        
        if (settings.demoMode)
            return 

        email = email.trim()

        let profile = await dataCache.getByIdentifier(identifier)
        if (!profile)
            throw new Exception({ 
                code : constants.ERROR_VALIDATION, 
                public: 'That email address isn\'t bound to an account.'
            })

        if (!profile.email)
            throw new Exception({ 
                code : constants.ERROR_EMAIL_NOT_SET, 
                public: 'Your account doesn\t have an email address. Please reset password directly (see Tuna "help" guide for more info)'
            })

        if (profile.email.trim().toLowerCase() != email.toLowerCase())
            throw new Exception({ 
                code : constants.ERROR_EMAIL_NOT_SET, 
                public: 'The email address you gave was not found. Please reset password directly (see Tuna "help" guide for more info)'
            })

        let verificationKey = randomstring.generate(32)

        profile.passwordResetKey = verificationKey
        await dataCache.update(profile)

        let resetLink = `${settings.siteUrl}/newPassword?key=${verificationKey}`
        await sendgrid(
            profile.email, 
            'Password reset', 
            `Hi. If you forgot your password, you can click on the link below to enter a new one.\n\n ${resetLink}\n\nRegards\nSome robot`)
    },


    /**
     *
     */
    _isPasswordValid (profile, password){
        const crypto = require('crypto'),
            sha512 = crypto.createHmac('sha512', profile.salt)

        sha512.update(password)

        return profile.hash === sha512.digest('hex')
    },


    /**
     * Logs user in. returns profile id of the user that was logged in
     */
    async authenticate(identifier, password){
        const 
            dataCache = require(_$+'cache/profile'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants')

        if (!identifier)
            throw new Exception({ 
                code : constants.ERROR_VALIDATION, 
                public : 'Email required' 
            })

        if (!password)
            throw new Exception({ 
                code : constants.ERROR_VALIDATION,
                public : 'Invalid username / password' 
            })

        // note that identifier is always trimmed and set to lowercase()
        let profile = await dataCache.getByIdentifier(identifier.trim().toLowerCase());
        if (!profile)
            throw new Exception({ 
                code : constants.ERROR_VALIDATION, 
                public : 'Invalid username / password' 
            })

        if (!this._isPasswordValid(profile, password))
            throw new Exception({ 
                code : constants.ERROR_VALIDATION, 
                public : 'Invalid username / password' 
            });

        return profile.id;
    },


    /**
     *
     */
    async resetPassword(key, password, currentPassword, profileId){
        let 
            fs = require('fs-extra'),
            settings = require(_$+'helpers/settings'),
            dataCache = require(_$+'cache/profile'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            profile = null,
            public

        if (settings.demoMode)
            return 

        if (key) {
            profile = await dataCache.getByPasswordResetKey(key)
            public = 'Invalid reset key'
        } else if (profileId){
            profile = await dataCache.getById(profileId)
            public = 'Invalid session'
        }

        // this shouldn't happen, as calling method enforces session
        if (!profile)
            throw new Exception({ 
                code : constants.ERROR_VALIDATION, 
                public  
            })

        // verify current password if no key, ie, already authenticated
        if (!key && !this._isPasswordValid(profile, currentPassword))
            throw new Exception({ 
                code : constants.ERROR_VALIDATION,
                public : 'Current password is invalid' 
            })

        profile.password = password
        profile.emailVerificationKey = null

        this._processPassword(profile)

        await dataCache.update(profile)

        // on password update, delete autogened password, it isn't really a security risk as it's
        // no longer valid, but let's keep things tidy
        if (await fs.pathExists(settings.autogeneratedPasswordFile))
            await fs.remove(settings.autogeneratedPasswordFile)
    },


    /**
     *
     */
    async removeLastfm(profileId){
        const dataCache = require(_$+'cache/profile'),
            settings = require(_$+'helpers/settings'),
            profile = await dataCache.getById(profileId)

        if (settings.demoMode)
            return profile

        profile.scrobbleToken = null
        await dataCache.update(profile)
    },

    
    /**
     *
     */
    async songsHashValid(profileId, hash){
        const 
            settings = require(_$+'helpers/settings'),
            dataCache = require(_$+'cache/profile'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            profile = await dataCache.getById(profileId)
            
        if (!profile)
            throw new Exception({ code : constants.ERROR_INVALID_USER_OR_SESSION })

        const source = profile.sources[settings.musicSource]
        if (!source)
            return false

        return source.indexHash === hash
    },


    /**
     *
     */
    async deleteSource(profileId){
        const 
            settings = require(_$+'helpers/settings'),
            dataCache = require(_$+'cache/profile'),
            Exception = require(_$+'types/exception'),
            constants = require(_$+'types/constants'),
            songsLogic = require(_$+'logic/songs'),
            playlistsLogic = require(_$+'logic/playlists'),
            profile = await dataCache.getById(profileId)
    
        if (settings.demoMode)
            return

        if (!profile)
            throw new Exception({ code : constants.ERROR_INVALID_USER_OR_SESSION })

        profile.sources = {}

        await dataCache.update(profile)

        // delete all songs
        await songsLogic.deleteForProfile(profile.id)
        await playlistsLogic.deleteAll(profile.id)
    },


    /**
     * Converts a password to hash + salt on a profile object. The password is deleted in the process so it never
     * reaches the database and is thus never stored openly.
     */
    _processPassword(profile){
        const settings = require(_$+'helpers/settings'),
            randomstring = require('randomstring'),
            crypto = require('crypto')

        if (!profile.password)
            return

        profile.salt = randomstring.generate(settings.passwordLength)
        profile.isPasswordChangeForced = false
        
        const sha512 = crypto.createHmac('sha512', profile.salt)
        sha512.update(profile.password)
        profile.hash = sha512.digest('hex')

        // destroy password, it must not be saved to database
        delete profile.password
    }


}