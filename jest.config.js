/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   transform: {
      '^.+\\.tsx?$': ['ts-jest', {}],
      '^.+\\.jsx?$': 'babel-jest',
   },
   transformIgnorePatterns: ['/node_modules/(?!@faker-js/faker)'],
}
