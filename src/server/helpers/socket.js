let 
    Socketio = require('socket.io'),
    authTokenLogic = require(_$+'logic/authToken'),
    _io = null

module.exports = {

    initialize(expressServer){
        _io = Socketio(expressServer)
        _io.on('connection', function (socket) {
            socket.on('response.authToken', async function (data) {
                // validate token
                let authToken = await authTokenLogic.getById(data.authToken)
                if (!authToken)
                    return socket.emit('auth.invalidToken')

                socket.join(data.authToken)
            });

            socket.on('notify.logout', async function(data){
                socket.leave(data.authToken)
            })

            socket.emit('request.authToken')
        })
    },

    get(){
        return _io
    },

    send(authToken, message, data){
        if (data)
            _io.to(authToken).emit(message, data)
        else
            _io.to(authToken).emit(message)
    }

}