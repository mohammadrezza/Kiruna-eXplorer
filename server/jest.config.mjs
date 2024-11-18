const config = {
    moduleFileExtensions: ['js', 'mjs'],
    transform: {
        "^.+\\.mjs$": "babel-jest",
    },
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/unit/**/*test.mjs']
}
export default config;