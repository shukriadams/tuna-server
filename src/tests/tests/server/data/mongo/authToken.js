
const 
    createTest = require(_$t+'helpers/mongo/create'),
    deleteTest = require(_$t+'helpers/mongo/create')
    deleteForProfileTest = require(_$t+'helpers/mongo/deleteForProfile'),
    getSingleByQueryTest = require(_$t+'helpers/mongo/getSingleByQuery'),
    getMultipleByQueryTest = require(_$t+'helpers/mongo/getMultipleByQuery')

createTest('data/mongo/authToken')
deleteTest('data/mongo/authToken')
deleteForProfileTest('data/mongo/authToken')
getSingleByQueryTest('data/mongo/authToken', 'getById')
getMultipleByQueryTest('data/mongo/authToken', 'getForProfile')
