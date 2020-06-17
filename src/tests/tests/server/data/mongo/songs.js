const 
    createManyTest = require(_$t+'helpers/mongo/createMany'),
    deleteManyTest = require(_$t+'helpers/mongo/deleteMany'),
    deleteTest = require(_$t+'helpers/mongo/delete'),
    getSingleByQuery = require(_$t+'helpers/mongo/getSingleByQuery'),
    getMultipleByQueryTest = require(_$t+'helpers/mongo/getMultipleByQuery'),
    updateTest = require(_$t+'helpers/mongo/update')

createManyTest('data/mongo/songs')
updateTest('data/mongo/songs')
getMultipleByQueryTest('data/mongo/songs', 'getAll')
deleteTest('data/mongo/songs')
deleteManyTest('data/mongo/songs', 'deleteAll')
getSingleByQuery('data/mongo/playlist', 'getById')