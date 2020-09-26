/*
const constants = require(_$+'types/constants'),
    mocha = require(_$t+'helpers/testbase')

mocha('logic/songs/scrobble', async(ctx)=>{

    it('logic/songs/scrobble::happy::scrobbles a play', async () => {
        let calls = 0

        // return a song
        ctx.inject.object(_$+'logic/songs', {
            _getById (){
                return {}
            }
        })

        // must find a profile with scrobbling enabled
        ctx.inject.object(_$+'logic/profiles', {
            getById (){
                return {
                    scrobbleToken : 'my-token'
                }
            }
        })

        // call to lastfm
        ctx.inject.object(_$+'helpers/lastfm', {
            scrobble (){
                calls++
            }
        })

        ctx.inject.object(_$+'helpers/cache', {
            // cleans up after scrobbling
            remove(){
                calls++
            },
            // song must already be registered as playing in cache
            get (){
                return {
                    songId : 'song-id',
                    // must be at least 30 seconds ago, we'll use 31 seconds
                    started : new Date(Date.now() - 31000)
                }
            }
        })

        const logic = require(_$+'logic/songs')
        await logic.scrobble('my-profile', 'song-id')

        ctx.assert.equal(calls, 2)
    })




    it('logic/songs/scrobble::unhappy   no song found', async () => {

        // return no song to trigger exception
        ctx.inject.object(_$+'logic/songs', {
            _getById (){
                return null
            }
        })

        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.scrobble('my-profile', 'song-id') )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_SONG)
    })



    it('logic/songs/scrobble::unhappy   song not already playing', async () => {

        // return song to pass
        ctx.inject.object(_$+'logic/songs', {
            _getById (){
                return {}
            }
        })

        ctx.inject.object(_$+'helpers/cache', {
            // return nothing to trigger exception
            get (){
                return null
            }
        })

        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.scrobble('my-profile', 'song-id') )

        ctx.assert.equal(exception.log, 'Expected playSession was not retrieved')
    })




    it('logic/songs/scrobble::unhappy   different song currently playing', async () => {

        // return song to pass
        ctx.inject.object(_$+'logic/songs', {
            _getById (){
                return {}
            }
        })

        ctx.inject.object(_$+'helpers/cache', {
            // return other song to trigger exception
            get (){
                return {
                    songId : 'another-song-id'
                }
            }
        })

        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.scrobble('my-profile', 'song-id') )

        ctx.assert.equal(exception.log, 'playSession contains a different song')
    })




    it('logic/songs/scrobble::happy    not enough time elapsed', async () => {
        let calls = 0

        // return a song
        ctx.inject.object(_$+'logic/songs', {
            _getById (){
                return {}
            }
        })

        // must find a profile with scrobbling enabled
        ctx.inject.object(_$+'logic/profiles', {
            getById (){
                return {
                    scrobbleToken : 'my-token'
                }
            }
        })

        ctx.inject.object(_$+'helpers/cache', {
            // song must already be registered as playing in cache
            get (){
                return {
                    songId : 'song-id',
                    // must be at least 30 seconds ago, we'll return 28 to trigger exception
                    started : new Date(Date.now() - 28000)
                }
            }
        })

        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.scrobble('my-profile', 'song-id') )

        ctx.assert.equal(exception.log, 'pre-halftime scrobble attempt')
    })




    it('logic/songs/scrobble::happy    invalid profile', async () => {
        let calls = 0

        // return a song
        ctx.inject.object(_$+'logic/songs', {
            _getById (){
                return {}
            }
        })

        // must find a profile with scrobbling enabled
        ctx.inject.object(_$+'logic/profiles', {
            getById (){
                return null
            }
        })

        ctx.inject.object(_$+'helpers/cache', {
            // song must already be registered as playing in cache
            get (){
                return {
                    songId : 'song-id',
                    // must be at least 30 seconds ago, we'll use 31 seconds
                    started : new Date(Date.now() - 31000)
                }
            }
        })

        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.scrobble('my-profile', 'song-id') )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })



    
    it('logic/songs/scrobble::happy::no scrobble token', async () => {
        // return a song
        ctx.inject.object(_$+'logic/songs', {
            _getById (){
                return {}
            }
        })

        // return profile with no scrobbling token
        ctx.inject.object(_$+'logic/profiles', {
            getById (){
                return { }
            }
        })

        ctx.inject.object(_$+'helpers/cache', {
            // song must already be registered as playing in cache
            get (){
                return {
                    songId : 'song-id',
                    // must be at least 30 seconds ago, we'll use 31 seconds
                    started : new Date(Date.now() - 31000)
                }
            }
        })

        const logic = require(_$+'logic/songs'),
            exception = await ctx.assert.throws(async () => await logic.scrobble('my-profile', 'song-id') )

        ctx.assert.equal(exception.log, 'profile not scrobbling')
    })
})
*/