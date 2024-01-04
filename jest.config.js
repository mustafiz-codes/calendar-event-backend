export default {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  setupFiles: ["./mocha-setup.js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
