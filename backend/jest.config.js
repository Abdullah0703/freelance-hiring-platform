
module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./tests/setup.js'],
    testPathIgnorePatterns: ['/node_modules/'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/',
        '/config/'
    ]
};
