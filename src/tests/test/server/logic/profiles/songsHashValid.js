const constants = require(_$+'types/constants'),
    mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/songsHashValid', async(ctx)=>{

    it('logic/profiles/songsHashValid::happy    songs hash are valid', async () => {
        let settings = require(_$+'helpers/settings'),
            profile = {
                sources : {}
            }

        // set up a source
        profile.sources[settings.musicSource] = {indexHash : 'myhash'}

        ctx.inject.object(_$+'cache/profile', {
            getById (){
                return profile
            }
        })

        const logic = require(_$+'logic/profiles'),
            isValid = await logic.songsHashValid('my-id', 'myhash')

        ctx.assert.true(isValid)
    })




    it('logic/profiles/songsHashValid::unhappy    no profile found', async () => {
        ctx.inject.object(_$+'cache/profile', {
            getById (){
                return null
            }
        })

        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.songsHashValid('my-id', 'myhash') )

        ctx.assert.equal(exception.code, constants.ERROR_INVALID_USER_OR_SESSION)
    })




    it('logic/profiles/songsHashValid::unhappy    path/no source', async () => {
        let profile = {
                sources : {}
            }

        ctx.inject.object(_$+'cache/profile', {
            getById (){
                return profile
            }
        })

        const logic = require(_$+'logic/profiles'),
            isValid = await logic.songsHashValid('my-id', 'myhash')

        ctx.assert.false(isValid)
    })

})
