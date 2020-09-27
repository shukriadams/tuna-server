const mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/authenticate', async(ctx)=>{

    it('logic/profiles/authenticate::happy    authenticates profile', async () => {

        ctx.inject.object(_$+'cache/profile', {
            getByIdentifier (){
                return { id : 'some-id' }
            }
        })

        ctx.inject.object(_$+'logic/profiles', {
            _isPasswordValid (){
                return true
            }
        })

        const logic = require(_$+'logic/profiles'),
            id = await logic.authenticate('my-id', 'mypass')

        ctx.assert.equal(id, 'some-id')
    })




    it('logic/profiles/authenticate::unhappy    no identifier', async () => {
        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.authenticate(null, 'mypass') )

        ctx.assert.equal(exception.public, 'Email required')
    })




    it('logic/profiles/authenticate::unhappy    no password', async () => {
        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.authenticate('my-id', null) )

        ctx.assert.equal(exception.public, 'Invalid username / password')
    })




    it('logic/profiles/authenticate::unhappy    profile not found', async () => {
        ctx.inject.object(_$+'cache/profile', {
            getByIdentifier (){
                return null
            }
        })

        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.authenticate('my-id', 'mypass') )

        ctx.assert.equal(exception.public, 'Invalid username / password')
    })




    it('logic/profiles/authenticate::unhappy    invalid password', async () => {
        ctx.inject.object(_$+'cache/profile', {
            getByIdentifier (){
                return { id : 'some-id' }
            }
        })

        ctx.inject.object(_$+'logic/profiles', {
            _isPasswordValid (){
                return false
            }
        })

        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.authenticate('my-id', 'mypass') )

        ctx.assert.equal(exception.public, 'Invalid username / password')
    })

})
