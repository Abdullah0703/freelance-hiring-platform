beforeEach(() => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await require('../app/models').sequelize.close();
});