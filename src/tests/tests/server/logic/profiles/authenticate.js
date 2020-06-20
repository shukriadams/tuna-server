const mocha = require(_$t+'helpers/testbase')

mocha('logic/profiles/authenticate', async(ctx)=>{

    it('happy path : authenticates profile', async () => {

        ctx.inject.object(_$+'cache/profile', {
            getByIdentifier : ()=>{
                return { id : 'some-id' }
            }
        })

        ctx.inject.object(_$+'logic/profiles', {
            _isPasswordValid : ()=>{
                return true
            }
        })

        const logic = require(_$+'logic/profiles'),
            id = await logic.authenticate('my-id', 'mypass')

        ctx.assert.equal(id, 'some-id')
    })


    it('unhappy happy path : no identifier', async () => {
        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.authenticate(null, 'mypass') )

        ctx.assert.equal(exception.public, 'Email required')
    })


    it('unhappy happy path : no password', async () => {
        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.authenticate('my-id', null) )

        ctx.assert.equal(exception.public, 'Invalid username / password')
    })


    it('unhappy happy path : profile not found', async () => {
        ctx.inject.object(_$+'cache/profile', {
            getByIdentifier : ()=>{
                return null
            }
        })

        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.authenticate('my-id', 'mypass') )

        ctx.assert.equal(exception.public, 'Invalid username / password')
    })


    it('unhappy happy path : invalid password', async () => {
        ctx.inject.object(_$+'cache/profile', {
            getByIdentifier : ()=>{
                return { id : 'some-id' }
            }
        })

        ctx.inject.object(_$+'logic/profiles', {
            _isPasswordValid : ()=>{
                return false
            }
        })

        const logic = require(_$+'logic/profiles'),
            exception = await ctx.assert.throws(async () => await logic.authenticate('my-id', 'mypass') )

        ctx.assert.equal(exception.public, 'Invalid username / password')
    })

})
