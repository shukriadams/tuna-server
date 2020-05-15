import KeyWatcher from './../keyWatcher/index'

// singleton watchers for keys
const shiftKey = new KeyWatcher({ key : 'Shift' })
const ctrlKey = new KeyWatcher({ key : 'Control' })

export { shiftKey, ctrlKey}