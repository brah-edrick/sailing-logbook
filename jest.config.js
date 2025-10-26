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
  projects: [
    {
      displayName: "api",
      testMatch: ["<rootDir>/src/__tests__/app/api/**/*.test.ts"],
      testEnvironment: "node",
      setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
      transform: {
        ...tsJestTransformCfg,
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@test-utils/(.*)$": "<rootDir>/src/__tests__/test-utils/$1",
      },
      setupFiles: ["<rootDir>/jest.env.js"],
    },
    {
      displayName: "components",
      testMatch: ["<rootDir>/src/__tests__/components/**/*.test.tsx"],
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
      transform: {
        "^.+\\.(ts|tsx)$": [
          "ts-jest",
          {
            tsconfig: {
              jsx: "react-jsx",
            },
          },
        ],
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@test-utils/(.*)$": "<rootDir>/src/__tests__/test-utils/$1",
      },
      setupFiles: ["<rootDir>/jest.env.js"],
    },
  ],
};
