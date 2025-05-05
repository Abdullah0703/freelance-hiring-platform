beforeEach(() => {
    jest.clearAllMocks();
});

// afterAll(async () => {
//     await require('../app/models').sequelize.close();
// });
// new code added below
afterAll(async () => {
    const models = require('../app/models');
    if (models.sequelize && typeof models.sequelize.close === 'function') {
        await models.sequelize.close();
    }
});