import appSettings from './../appSettings/appSettings'

export default (message) => {
    if (appSettings.mode === 'grunt')
        console.log(message)
}