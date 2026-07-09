import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // Resolve alias mapping
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    // Explicitly point Jest to the custom Babel config to avoid Next.js detection
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { configFile: "./babel.config.jest.js" }],
  },
  // Ensure Babel compiles ES module syntax in next-auth and related sub-packages
  transformIgnorePatterns: [
    "/node_modules/(?!(next-auth|@auth/core|jose|@panva/hkdf)/)",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "actions/**/*.{js,jsx,ts,tsx}",
    "components/ui/**/*.{js,jsx,ts,tsx}",
    "store/**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
};

export default config;
