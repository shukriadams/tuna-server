const 
    createTest = require(_$t+'helpers/mongo/create'),
    deleteTest = require(_$t+'helpers/mongo/create')
    updateTest = require(_$t+'helpers/mongo/update'),
    getSingleByQuery = require(_$t+'helpers/mongo/getSingleByQuery'),
    getMultipleByQueryTest = require(_$t+'helpers/mongo/getMultipleByQuery')

createTest('data/mongo/profile')
deleteTest('data/mongo/profile')
getSingleByQuery('data/mongo/profile', 'getById')
getSingleByQuery('data/mongo/profile', 'getByPasswordResetKey')
getSingleByQuery('data/mongo/profile', 'getByIdentifier')
getMultipleByQueryTest('data/mongo/profile', 'getAll')
updateTest('data/mongo/profile')
