module.exports = {
    automock: false,
    setupFiles: ['<rootDir>/setupJest.js'],
    preset: 'react-native',
    transform: {
        '^.+\\.(js|ts|tsx)$': require.resolve('react-native/jest/preprocessor.js'),
    },
};
