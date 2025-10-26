const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@test-utils/(.*)$": "<rootDir>/src/__tests__/test-utils/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/src/__tests__/test-utils/"],
  setupFiles: ["<rootDir>/jest.env.js"],
};
