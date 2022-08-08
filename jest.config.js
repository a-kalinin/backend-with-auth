// import {defaults} from 'jest-config';
// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  transform: {},
  extensionsToTreatAsEsm : ['.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  // globalSetup: './src/jest/jestSetup.ts',
};

export default config;

// // Or async function
// module.exports = async () => {
//   return {
//     verbose: true,
//   };
// };
